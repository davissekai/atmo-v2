import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { regularPrompt, deepThinkPrompt } from "@/lib/ai/prompts";
import { getCacheKey, getCachedResponse, setCachedResponse } from "@/lib/ai/cache";

// TEMP: Disabled Edge runtime for local debugging
// export const runtime = "edge";

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

    // Get the last user message for cache key
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop();
    const userQuery = lastUserMessage?.content || "";

    // Only cache single-message queries (not conversations) and non-deepThink
    const isCacheable = messages.length === 1 && !deepThink && userQuery.length > 0;

    if (isCacheable) {
      const cacheKey = getCacheKey(cleanModelId, userQuery);
      const cachedResponse = getCachedResponse(cacheKey);

      if (cachedResponse) {
        console.log("API Route: Cache HIT - returning cached response");
        // Return cached response as a simple stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            // Send the cached text as a data stream chunk
            controller.enqueue(encoder.encode(`0:${JSON.stringify(cachedResponse)}\n`));
            controller.enqueue(encoder.encode(`e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0},"isContinued":false}\n`));
            controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`));
            controller.close();
          }
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "x-vercel-ai-data-stream": "v1",
            "x-cache-hit": "true",
          },
        });
      }
    }

    console.log("API Route: Starting streamText with model:", cleanModelId);
    console.log("API Route: Messages:", JSON.stringify(messages));
    console.log("API Route: DeepThink:", deepThink);

    // Accumulate the full response for caching
    let fullResponse = "";

    const result = streamText({
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
      onFinish: ({ text, finishReason, usage }) => {
        console.log("API Route: Stream finished");
        console.log("API Route: Finish reason:", finishReason);
        console.log("API Route: Text length:", text?.length || 0);
        console.log("API Route: Usage:", JSON.stringify(usage));

        // Cache the response if it was cacheable
        if (isCacheable && text) {
          const cacheKey = getCacheKey(cleanModelId, userQuery);
          setCachedResponse(cacheKey, text);
        }
      },
    });

    // Log any streaming errors asynchronously (doesn't block the response)
    result.text.catch(err => {
      console.error("API Route: Stream error:", err);
    });

    console.log("API Route: streamText returned, forwarding to toDataStreamResponse");

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("rate") || errorMessage.includes("quota") || errorMessage.includes("429")) {
          return "Rate limit exceeded. Please try again later.";
        }
        return "An internal error occurred.";
      }
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

