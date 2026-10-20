/**
 * Google Gemini API integration (free tier via Google AI Studio).
 * Streams responses and, when enabled, grounds them with Google Search.
 * Docs: https://ai.google.dev/gemini-api/docs/google-search
 */

const GEMINI_API_BASE =
  process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL_ID = process.env.GEMINI_MODEL_ID || "gemini-2.5-flash";

export interface ChatMessage {
  role: string;
  content: string;
}

export interface GeminiSource {
  title: string;
  url: string;
  content: string;
}

interface GeminiStreamOptions {
  systemPrompt: string;
  messages: ChatMessage[];
  useSearch: boolean;
  deepThink: boolean;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/** Calls Gemini's SSE streaming endpoint and returns the raw response. */
export async function streamGemini({
  systemPrompt,
  messages,
  useSearch,
  deepThink,
}: GeminiStreamOptions): Promise<Response> {
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      // Fast answers by default; let the model think when Deep Think is on.
      thinkingConfig: { thinkingBudget: deepThink ? -1 : 0 },
    },
  };

  if (useSearch) {
    body.tools = [{ google_search: {} }];
  }

  return fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL_ID}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY || "",
      },
      body: JSON.stringify(body),
    }
  );
}

/** Pulls the answer text out of one streamed Gemini chunk. */
export function extractGeminiText(chunk: any): string {
  const parts = chunk?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((p: any) => typeof p?.text === "string" && !p.thought)
    .map((p: any) => p.text)
    .join("");
}

/** Pulls the web sources Google Search grounded the answer on, if any. */
export function extractGeminiSources(chunk: any): GeminiSource[] {
  const groundingChunks = chunk?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(groundingChunks)) return [];
  return groundingChunks
    .filter((c: any) => c?.web?.uri)
    .map((c: any) => ({
      title: c.web.title || c.web.uri,
      url: c.web.uri,
      content: "",
    }));
}
