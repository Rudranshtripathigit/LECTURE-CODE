import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { checkAiRateLimit, resolveRateLimitKey } from "@/lib/redis";
import { generateGeminiText } from "@/lib/gemini";

// ----------------------------------------------------------------------
// POST /api/ai/analyze
// Accepts a code snippet and/or a free-form prompt and returns
// real-time debugging tips, algorithm explanations, or logic breakdowns
// from Gemini. Rate limited to 10 requests/min per user (or IP).
// ----------------------------------------------------------------------

const AnalyzeRequestSchema = z.object({
  code: z.string().max(20_000).optional(),
  language: z.string().max(40).optional().default("plaintext"),
  prompt: z.string().min(1, "prompt is required").max(4_000),
  mode: z.enum(["debug", "explain", "optimize"]).default("debug"),
});

const MODE_INSTRUCTIONS: Record<string, string> = {
  debug:
    "You are a senior software engineer pair-debugging with a student. " +
    "Identify bugs, logic errors, and edge cases in the provided code. " +
    "Explain the root cause plainly, then show a corrected snippet. " +
    "Be concise and use short paragraphs or bullet points.",
  explain:
    "You are a patient computer science instructor. Explain the algorithm " +
    "or code's logic step by step, including its time and space complexity " +
    "using Big-O notation. Use short paragraphs or bullet points.",
  optimize:
    "You are a performance-focused senior engineer. Analyze the provided " +
    "code for inefficiencies and propose an optimized version, explaining " +
    "the resulting time and space complexity improvement.",
};

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
    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language, prompt, mode } = parsed.data;

    const fullPrompt = code
      ? `User question: ${prompt}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``
      : `User question: ${prompt}`;

    const text = await generateGeminiText({
      systemInstruction: MODE_INSTRUCTIONS[mode],
      prompt: fullPrompt,
      temperature: 0.3,
    });

    return NextResponse.json({ result: text, mode });
  } catch (err) {
    console.error("[api/ai/analyze] error:", err);
    return NextResponse.json(
      { error: "Failed to analyze code. Please try again." },
      { status: 500 }
    );
  }
}
