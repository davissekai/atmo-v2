import { regularPrompt, deepThinkPrompt } from "@/lib/ai/prompts";
import { getCacheKey, getCachedResponse, setCachedResponse } from "@/lib/ai/cache";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_ID = "stepfun/step-3.5-flash:free";

export async function POST(req: Request) {
  console.log("API Route: Using OpenRouter with model:", MODEL_ID);
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { messages, deepThink } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the last user message for cache key
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === "user").pop();
    const userQuery = lastUserMessage?.content || "";

    // Only cache single-message queries
    const isCacheable = messages.length === 1 && !deepThink && userQuery.length > 0;

    if (isCacheable) {
      const cacheKey = getCacheKey(MODEL_ID, userQuery);
      const cachedResponse = getCachedResponse(cacheKey);

      if (cachedResponse) {
        console.log("API Route: Cache HIT");
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
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

    // Build messages with system prompt
    const systemPrompt = deepThink ? deepThinkPrompt : regularPrompt;
    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    console.log("API Route: Calling OpenRouter...");

    // Direct fetch to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://atmo-v2.vercel.app",
        "X-Title": "Atmo Climate Assistant",
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: allMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `OpenRouter error: ${response.status}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response back to client
    const encoder = new TextEncoder();
    let fullResponse = "";

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              // Stream finished
              const duration = Date.now() - startTime;
              console.log("API Route: Response completed in", duration, "ms");
              console.log("API Route: Text length:", fullResponse.length);

              // Cache if applicable
              if (isCacheable && fullResponse) {
                const cacheKey = getCacheKey(MODEL_ID, userQuery);
                setCachedResponse(cacheKey, fullResponse);
              }

              // Send finish events
              controller.enqueue(encoder.encode(`e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0},"isContinued":false}\n`));
              controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                // Send as Vercel AI data stream format
                controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
              }
            } catch (e) {
              // Skip unparseable chunks
            }
          }
        }
      }
    });

    return new Response(response.body?.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1",
      },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
