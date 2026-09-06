import { GoogleGenAI } from "@google/genai";

// ----------------------------------------------------------------------
// Google Gemini SDK initialization
// ----------------------------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;

const hasValidKey =
  !!apiKey &&
  apiKey !== "missing-gemini-api-key" &&
  apiKey.trim().length > 0;

if (!hasValidKey) {
  console.warn(
    "[gemini] GEMINI_API_KEY is not set. " +
      "Add it to your .env file and restart the dev server."
  );
}

export const genAI = new GoogleGenAI({
  apiKey: apiKey ?? "missing-gemini-api-key",
});

// Use the model configured in .env, with a fallback.
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.6-flash";

// ----------------------------------------------------------------------
// Gemini error helper
// ----------------------------------------------------------------------

function describeGeminiError(err: unknown): string {
  if (!hasValidKey) {
    return (
      "GEMINI_API_KEY is missing in your .env file. " +
      "Get a key from Google AI Studio and restart the dev server."
    );
  }

  const message = err instanceof Error ? err.message : String(err);

  if (
    /api key not valid|invalid.*api key|API_KEY_INVALID/i.test(
      message
    )
  ) {
    return "Your GEMINI_API_KEY is invalid or expired. Generate a new key.";
  }

  if (
    /quota|rate limit|RESOURCE_EXHAUSTED|429/i.test(message)
  ) {
    return "Gemini API quota/rate limit exceeded. Please try again later.";
  }

  if (
    /fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(
      message
    )
  ) {
    return "Couldn't reach Gemini's API. Check your internet connection.";
  }

  if (/model.*not found|404/i.test(message)) {
    return `Gemini model "${GEMINI_MODEL}" isn't available for this key/region.`;
  }

  return `Gemini request failed: ${message}`;
}

// ----------------------------------------------------------------------
// Generate plain text
// ----------------------------------------------------------------------

export async function generateGeminiText(params: {
  systemInstruction: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const {
    systemInstruction,
    prompt,
    temperature = 0.4,
    maxOutputTokens = 2048,
  } = params;

  if (!hasValidKey) {
    throw new Error(describeGeminiError(null));
  }

  try {
    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,

      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      config: {
        systemInstruction,
        temperature,
        maxOutputTokens,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (err) {
    console.error(
      "[gemini] generateContent failed:",
      err
    );

    throw new Error(describeGeminiError(err));
  }
}

// ----------------------------------------------------------------------
// Extract JSON from Gemini response
// ----------------------------------------------------------------------

function extractJsonBlock(raw: string): string {
  const stripped = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = stripped.indexOf("{");
  const firstBracket = stripped.indexOf("[");

  const starts = [firstBrace, firstBracket].filter(
    (i) => i !== -1
  );

  if (starts.length === 0) {
    return stripped;
  }

  const start = Math.min(...starts);

  const openChar = stripped[start];

  const closeChar =
    openChar === "{" ? "}" : "]";

  let depth = 0;

  for (
    let i = start;
    i < stripped.length;
    i++
  ) {
    if (stripped[i] === openChar) {
      depth++;
    }

    if (stripped[i] === closeChar) {
      depth--;
    }

    if (depth === 0) {
      return stripped.slice(start, i + 1);
    }
  }

  return stripped.slice(start);
}

// ----------------------------------------------------------------------
// Generate structured JSON
// ----------------------------------------------------------------------

export async function generateGeminiJson<T>(params: {
  systemInstruction: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<T> {
  const {
    systemInstruction,
    prompt,
    temperature = 0.4,
    maxOutputTokens = 2048,
  } = params;

  if (!hasValidKey) {
    throw new Error(describeGeminiError(null));
  }

  let rawText = "";

  try {
    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,

      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      config: {
        systemInstruction,
        temperature,
        maxOutputTokens,

        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    rawText = text;

    return JSON.parse(
      extractJsonBlock(text)
    ) as T;
  } catch (err) {
    console.error(
      "[gemini] generateContent (JSON mode) failed:",
      err,
      "raw:",
      rawText
    );

    if (err instanceof SyntaxError) {
      throw new Error(
        "Gemini returned invalid JSON. Please try again."
      );
    }

    throw new Error(
      describeGeminiError(err)
    );
  }
}