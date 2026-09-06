import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { checkAiRateLimit, resolveRateLimitKey } from "@/lib/redis";
import { generateGeminiJson } from "@/lib/gemini";

// ----------------------------------------------------------------------
// POST /api/ai/summary
// Generates a structured lecture summary for the "Lecture Summary" modal:
// key topic takeaways, data-structure/architectural rules (e.g. LIFO),
// and time/space complexity notes. Rate limited to 10 requests/min.
// ----------------------------------------------------------------------

const SummaryRequestSchema = z.object({
  videoTitle: z.string().min(1).max(200),
  videoId: z.string().min(1).max(50),
  topicHint: z.string().max(500).optional(),
});

export interface LectureSummaryResult {
  keyTakeaways: string[];
  architecturalRules: string[];
  complexity: {
    time: string;
    space: string;
    notes: string;
  };
}

const SYSTEM_INSTRUCTION =
  "You are an expert computer science teaching assistant. Given a lecture " +
  "video's title (and an optional topic hint), produce a structured JSON " +
  "summary a student can skim in under a minute. Respond with ONLY raw " +
  "JSON, no markdown fences, no commentary, matching exactly this shape: " +
  '{"keyTakeaways": string[3-5 items], "architecturalRules": string[2-4 ' +
  'items describing core data-structure or algorithmic rules such as ' +
  'LIFO/FIFO ordering, invariants, or design constraints], "complexity": ' +
  '{"time": string (Big-O), "space": string (Big-O), "notes": string ' +
  "explaining the complexity briefly}}. If the topic is not clearly " +
  "algorithmic, still infer the most likely CS topic from the title and " +
  "produce your best-effort structured summary.";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const rateLimitKey = resolveRateLimitKey(session?.user?.id, ip);

    const { success, limit, remaining, reset } = await checkAiRateLimit(rateLimitKey);
    if (!success) {
      return NextResponse.json(
        { error: "Too Many Requests. Please slow down." },
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
    const parsed = SummaryRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { videoTitle, topicHint } = parsed.data;

    const prompt = `Video title: "${videoTitle}"${
      topicHint ? `\nAdditional context: ${topicHint}` : ""
    }`;

    const summary = await generateGeminiJson<LectureSummaryResult>({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      temperature: 0.4,
    });

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[api/ai/summary] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate lecture summary. Please try again." },
      { status: 500 }
    );
  }
}
