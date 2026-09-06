import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { checkAiRateLimit, resolveRateLimitKey } from "@/lib/redis";
import { generateGeminiJson } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

// ----------------------------------------------------------------------
// POST /api/ai/quiz
// Dynamically generates a multiple-choice practice quiz relevant to the
// current lecture topic, and (optionally) a code example. Rate limited
// to 10 requests/min per user (or IP).
// ----------------------------------------------------------------------

const QuizRequestSchema = z.object({
  videoTitle: z.string().min(1).max(200),
  topicHint: z.string().max(500).optional(),
  numQuestions: z.number().int().min(1).max(10).default(5),
});

const SubmitAnswerSchema = z.object({
  questionId: z.string().min(1),
  isCorrect: z.boolean(),
});

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

const SYSTEM_INSTRUCTION =
  "You are a quiz generator for a computer science education platform. " +
  "Given a lecture title and optional topic hint, generate multiple " +
  "choice practice questions. Respond with ONLY raw JSON, no markdown " +
  'fences, matching exactly: {"questions": [{"id": string (short slug), ' +
  '"prompt": string, "options": [{"id": "a"|"b"|"c"|"d", "text": string}] ' +
  '(exactly 4 options), "correctOptionId": string (matches one option ' +
  'id), "explanation": string (why the answer is correct)}]}. Make ' +
  "questions progressively test understanding, not just recall, and " +
  "ensure exactly one correct option per question.";

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
    const parsed = QuizRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { videoTitle, topicHint, numQuestions } = parsed.data;

    const prompt = `Video title: "${videoTitle}"${
      topicHint ? `\nAdditional context: ${topicHint}` : ""
    }\nGenerate exactly ${numQuestions} questions.`;

    const { questions } = await generateGeminiJson<{ questions: QuizQuestion[] }>({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      temperature: 0.6,
    });

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("[api/ai/quiz] error:", err);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------------
// PATCH /api/ai/quiz
// Records a quiz answer submission for a signed-in user. This does not
// call Gemini, so it is intentionally excluded from the AI rate limiter,
// but still requires authentication.
// ----------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = SubmitAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { questionId, isCorrect } = parsed.data;

    const submission = await prisma.quizSubmission.create({
      data: { userId: session.user.id, questionId, isCorrect },
    });

    if (isCorrect) {
      await prisma.profile.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, problemsSolved: 1 },
        update: { problemsSolved: { increment: 1 } },
      });
    }

    return NextResponse.json({ submission });
  } catch (err) {
    console.error("[api/ai/quiz PATCH] error:", err);
    return NextResponse.json(
      { error: "Failed to record quiz submission." },
      { status: 500 }
    );
  }
}
