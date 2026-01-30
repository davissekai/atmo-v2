import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { regularPrompt, deepThinkPrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model: modelId, deepThink } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use provided model or default to Gemini 3 Flash
    const providerModel = modelId || DEFAULT_CHAT_MODEL;

    // Strip provider prefix for the google() factory
    const cleanModelId = providerModel.startsWith("google/")
      ? providerModel.replace("google/", "")
      : providerModel;

    const result = await streamText({
      model: google(cleanModelId),
      system: deepThink ? deepThinkPrompt : regularPrompt,
      messages,
      // Enable thinking mode when Deep Think is on
      ...(deepThink && {
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingLevel: "medium",
            },
          },
        },
      }),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    // Check for specific error types
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // API key issues
    if (errorMessage.includes("API key") || errorMessage.includes("authentication")) {
      return new Response(
        JSON.stringify({ error: "API configuration error. Please check your API key." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Rate limit
    if (errorMessage.includes("rate") || errorMessage.includes("quota")) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generic server error
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
