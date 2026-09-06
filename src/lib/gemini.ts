import { GoogleGenAI } from "@google/genai";

// ----------------------------------------------------------------------
// Google Gemini SDK initialization (@google/genai)
// A single shared client instance is exported for use across all
// /api/ai/* route handlers.
// ----------------------------------------------------------------------
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "[gemini] GEMINI_API_KEY is not set. Get a free key at " +
      "https://aistudio.google.com/apikey and add it to .env — every " +
      "AI feature (summaries, debugging, quizzes) will 500 until then."
  );
}

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "missing-gemini-api-key",
});

export const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Thin wrapper around the Gemini `generateContent` call that enforces a
 * plain-text system instruction and returns the response text, throwing
 * a normalized error the API routes can catch and translate into a
 * clean HTTP response.
 */
export async function generateGeminiText(params: {
  systemInstruction: string;
  prompt: string;
  temperature?: number;
}): Promise<string> {
  const { systemInstruction, prompt, temperature = 0.4 } = params;

  try {
    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }
    return text;
  } catch (err) {
    console.error("[gemini] generateContent failed:", err);
    throw new Error("AI_GENERATION_FAILED");
  }
}

/**
 * Same as generateGeminiText but parses the result as JSON. Strips
 * markdown code fences defensively in case the model wraps its output.
 */
export async function generateGeminiJson<T>(params: {
  systemInstruction: string;
  prompt: string;
  temperature?: number;
}): Promise<T> {
  const raw = await generateGeminiText(params);
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("[gemini] Failed to parse JSON response:", cleaned);
    throw new Error("AI_INVALID_JSON");
  }
}
