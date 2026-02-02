/**
 * Simple in-memory LRU cache for chat responses.
 * Reduces API calls for repeated queries.
 */

interface CacheEntry {
    response: string;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const MAX_ENTRIES = 100;
const TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a cache key from query parameters.
 */
export function getCacheKey(model: string, query: string): string {
    // Normalize: lowercase, trim whitespace
    const normalizedQuery = query.toLowerCase().trim();
    return `${model}:${normalizedQuery}`;
}

/**
 * Get a cached response if it exists and isn't expired.
 */
export function getCachedResponse(key: string): string | null {
    const entry = cache.get(key);

    if (!entry) {
        return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > TTL_MS) {
        cache.delete(key);
        console.log(`[Cache] Expired: ${key.substring(0, 50)}...`);
        return null;
    }

    console.log(`[Cache] HIT: ${key.substring(0, 50)}...`);
    return entry.response;
}

/**
 * Store a response in the cache.
 */
export function setCachedResponse(key: string, response: string): void {
    // Evict oldest entries if at capacity
    if (cache.size >= MAX_ENTRIES) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) {
            cache.delete(oldestKey);
            console.log(`[Cache] Evicted oldest entry`);
        }
    }

    cache.set(key, {
        response,
        timestamp: Date.now(),
    });

    console.log(`[Cache] STORED: ${key.substring(0, 50)}... (${response.length} chars)`);
}

/**
 * Get cache statistics for debugging.
 */
export function getCacheStats(): { size: number; maxSize: number } {
    return {
        size: cache.size,
        maxSize: MAX_ENTRIES,
    };
}
