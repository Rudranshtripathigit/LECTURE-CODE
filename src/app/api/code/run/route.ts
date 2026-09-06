import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { redis, resolveRateLimitKey } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";

const JUDGE0_API_URL = (
  process.env.JUDGE0_API_URL || "https://ce.judge0.com"
).replace(/\/$/, "");

const codeRunRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "60 s"),
  analytics: true,
  prefix: "lecturecode:ratelimit:coderun",
});

const RunRequestSchema = z.object({
  code: z.string().min(1).max(20_000),
  language: z.enum(["cpp", "python", "javascript", "typescript", "java"]),
  stdin: z.string().max(4_000).optional().default(""),
});

// Judge0 CE language IDs. These are the active CE languages documented by
// the official instance: C++ 9.2, Python 3.8, JavaScript Node 12.14,
// TypeScript 3.7, Java OpenJDK 13.
const LANGUAGE_ID: Record<string, number> = {
  cpp: 54,
  python: 71,
  javascript: 63,
  typescript: 74,
  java: 62,
};

const TERMINAL_STATUS_IDS = new Set([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const rateLimitKey = resolveRateLimitKey(session?.user?.id, ip);

    const { success, limit, remaining, reset } = await codeRunRateLimiter.limit(
      rateLimitKey
    );

    if (!success) {
      return NextResponse.json(
        { error: "Too many run requests. Please slow down." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = RunRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language, stdin } = parsed.data;
    const languageId = LANGUAGE_ID[language];

    // Create a sandboxed execution job.
    const submitRes = await fetch(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
          stdin,
          cpu_time_limit: 5,
          wall_time_limit: 10,
          memory_limit: 128000,
        }),
        cache: "no-store",
      }
    );

    if (!submitRes.ok) {
      const errBody = await submitRes.text().catch(() => "");
      console.error("[api/code/run] Judge0 submission error:", submitRes.status, errBody);
      return NextResponse.json(
        {
          error:
            submitRes.status === 401
              ? "The Judge0 code execution service requires authentication right now. Configure a Judge0 provider/API key in your deployment."
              : `Code execution service returned ${submitRes.status}. ${errBody || "Please try again."}`,
        },
        { status: 502 }
      );
    }

    const submission = (await submitRes.json()) as { token?: string };

    if (!submission.token) {
      return NextResponse.json(
        { error: "Code execution service did not return a submission token." },
        { status: 502 }
      );
    }

    // Poll until Judge0 finishes the sandboxed job.
    for (let attempt = 0; attempt < 20; attempt++) {
      await sleep(750);

      const resultRes = await fetch(
        `${JUDGE0_API_URL}/submissions/${submission.token}?base64_encoded=false`,
        { cache: "no-store" }
      );

      if (!resultRes.ok) {
        const errBody = await resultRes.text().catch(() => "");
        console.error("[api/code/run] Judge0 polling error:", resultRes.status, errBody);
        return NextResponse.json(
          { error: `Code execution polling failed with ${resultRes.status}.` },
          { status: 502 }
        );
      }

      const result = await resultRes.json();
      const statusId = result?.status?.id;

      if (!TERMINAL_STATUS_IDS.has(statusId)) {
        continue;
      }

      return NextResponse.json({
        compile: result.compile_output
          ? {
              stdout: "",
              stderr: result.compile_output,
              code: null,
            }
          : null,
        run: {
          stdout: result.stdout ?? "",
          stderr: result.stderr ?? result.message ?? "",
          code: result.exit_code ?? statusId,
          signal: null,
        },
        status: result.status ?? null,
        time: result.time ?? null,
        memory: result.memory ?? null,
      });
    }

    return NextResponse.json(
      { error: "Code execution timed out while waiting for the execution service." },
      { status: 504 }
    );
  } catch (err) {
    console.error("[api/code/run] error:", err);

    const message =
      err instanceof Error ? err.message : "Failed to run code. Please try again.";

    const isNetworkError = /fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(message);

    return NextResponse.json(
      {
        error: isNetworkError
          ? "Couldn't reach the code execution service. Check your internet connection or firewall."
          : message,
      },
      { status: 500 }
    );
  }
}
