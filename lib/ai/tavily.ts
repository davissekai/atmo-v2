/**
 * Tavily Search API Integration
 * Provides real-time web search capabilities for grounding AI responses.
 */

const TAVILY_API_URL = process.env.TAVILY_API_URL || "https://api.tavily.com/search";

export interface TavilyResult {
    title: string;
    url: string;
    content: string;
    score: number;
}

export interface TavilySearchResponse {
    query: string;
    results: TavilyResult[];
    answer?: string;
}

/**
 * Determines if a query should trigger a web search.
 * Checks for keywords that indicate a need for real-time or recent data.
 */
export function shouldSearch(query: string): boolean {
    const lowerQuery = query.toLowerCase();

    // Keywords that indicate need for real-time data
    const searchTriggers = [
        "current",
        "latest",
        "recent",
        "today",
        "2024",
        "2025",
        "2026",
        "news",
        "update",
        "now",
        "this year",
        "this month",
        "this week",
        "right now",
        "at the moment",
        "as of",
        "cop28",
        "cop29",
        "cop30",
        "ipcc",
        "report",
        "study shows",
        "according to",
        "statistics",
        "data shows",
        "ppm", // CO2 levels
        "atmospheric co2",
        "temperature record",
        "sea level",
        "glacier",
        "arctic ice",
    ];

    return searchTriggers.some((trigger) => lowerQuery.includes(trigger));
}

/**
 * Performs a web search using Tavily API.
 * Optimized for climate-related queries.
 */
export async function searchWeb(query: string): Promise<TavilySearchResponse | null> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        console.warn("[Tavily] API key not configured");
        return null;
    }

    try {
        console.log("[Tavily] Searching for:", query);
        const startTime = Date.now();

        const response = await fetch(TAVILY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: apiKey,
                query: query, // Use raw query for better relevance
                search_depth: "advanced", // Better quality results
                max_results: 5,
                include_answer: true,
                topic: "general",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Tavily] API error:", response.status, errorText);
            return null;
        }

        const data = await response.json();
        const duration = Date.now() - startTime;
        console.log(`[Tavily] Search completed in ${duration}ms, found ${data.results?.length || 0} results`);

        return {
            query: data.query,
            results: data.results || [],
            answer: data.answer,
        };
    } catch (error) {
        console.error("[Tavily] Search failed:", error);
        return null;
    }
}

/**
 * Formats search results into a context string for the AI prompt.
 */
export function formatSearchContext(searchResponse: TavilySearchResponse): string {
    if (!searchResponse.results || searchResponse.results.length === 0) {
        return "";
    }

    let context = "\n\n---\n## Web Search Results (Real-time Data)\n\n";

    if (searchResponse.answer) {
        context += `**Summary:** ${searchResponse.answer}\n\n`;
    }

    context += "**Sources:**\n";
    searchResponse.results.slice(0, 3).forEach((result, index) => {
        context += `${index + 1}. [${result.title}](${result.url})\n`;
        context += `   ${result.content.slice(0, 200)}...\n\n`;
    });

    context += "---\n\nUse the above search results to ground your response in current data. Cite sources when using specific facts.\n";

    return context;
}
