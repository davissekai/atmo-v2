import { regularPrompt, deepThinkPrompt } from "@/lib/ai/prompts";
import { getCacheKey, getCachedResponse, setCachedResponse } from "@/lib/ai/cache";
import { searchWeb, shouldSearch, formatSearchContext } from "@/lib/ai/tavily";

export const runtime = 'edge';

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

    // Check if query needs web search for real-time data
    const needsSearch = shouldSearch(userQuery);
    let searchContext = "";
    let sources: { title: string; url: string; content: string }[] = [];

    if (needsSearch) {
      console.log("API Route: Query triggers web search");
      const searchResults = await searchWeb(userQuery);
      if (searchResults && searchResults.results.length > 0) {
        searchContext = formatSearchContext(searchResults);

        // Only include sources with high relevance score (>0.5)
        const relevantResults = searchResults.results.filter(r => r.score > 0.5);
        sources = relevantResults.slice(0, 5).map(r => ({
          title: r.title,
          url: r.url,
          content: r.content?.slice(0, 150) || "",
        }));

        console.log(`API Route: Search completed. ${searchResults.results.length} total, ${sources.length} relevant sources`);
      }
    }

    // Build system prompt with search context if available
    const basePrompt = deepThink ? deepThinkPrompt : regularPrompt;
    const systemPrompt = searchContext
      ? `${basePrompt}\n\n${searchContext}`
      : basePrompt;

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
      // Persistent decoder and buffer for handling chunk boundaries
      start() {
        (this as any).decoder = new TextDecoder();
        (this as any).buffer = "";
      },
      async transform(chunk, controller) {
        const text = (this as any).decoder.decode(chunk, { stream: true });
        (this as any).buffer += text;

        // Split on newlines, keeping incomplete lines in the buffer
        const lines = (this as any).buffer.split("\n");
        (this as any).buffer = lines.pop() || ""; // Keep last incomplete line

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith("data: ")) {
            const data = trimmedLine.slice(6);
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

              // Emit sources if web search was used (custom event prefix '9:')
              if (sources.length > 0) {
                controller.enqueue(encoder.encode(`9:${JSON.stringify(sources)}\n`));
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
              // JSON parse failed - this line might be incomplete, add back to buffer
              (this as any).buffer = trimmedLine + "\n" + (this as any).buffer;
              break; // Stop processing lines, wait for more data
            }
          }
        }
      },
      flush(controller) {
        // Process any remaining buffer content
        const remaining = (this as any).buffer.trim();
        if (remaining && remaining.startsWith("data: ")) {
          const data = remaining.slice(6);
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`0:${JSON.stringify(content)}\n`));
            }
          } catch (e) {
            console.error("API Route: Failed to parse remaining buffer:", e);
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
