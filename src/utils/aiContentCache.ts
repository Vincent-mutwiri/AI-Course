/**
 * AI Content Cache Utility
 * 
 * Extends the existing aiCache with localStorage-based caching for AI-generated content.
 * Features:
 * - 7-day expiration for cached content
 * - Max 50 entries per course with LRU eviction
 * - Cache statistics tracking (hit rate)
 * - Course-specific cache isolation
 */

import { IBlock, BlockType } from '@/types/page';
import { CourseContext } from '@/services/courseContextBuilder';

const CACHE_PREFIX = 'ai_content_cache_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_ENTRIES_PER_COURSE = 50;
const STATS_KEY = 'ai_content_cache_stats';

export interface GenerationOptions {
    tone?: 'formal' | 'conversational' | 'encouraging';
    readingLevel?: 'high-school' | 'college' | 'professional';
    length?: 'brief' | 'moderate' | 'detailed';
    [key: string]: any;
}

interface CachedContent {
    content: any;
    timestamp: number;
    lastAccessed: number;
    blockType: BlockType;
    courseId: string;
}

interface CacheStats {
    hits: number;
    misses: number;
    totalRequests: number;
}

/**
 * Generate a unique cache key based on block type, prompt, context, and options
 */
function generateCacheKey(
    blockType: BlockType,
    prompt: string,
    context: CourseContext,
    options?: GenerationOptions
): string {
    // Create a deterministic hash of the inputs
    const contextHash = JSON.stringify({
        courseId: context.courseId,
        moduleId: context.moduleId,
        lessonId: context.lessonId,
        objectives: context.learningObjectives,
    });

    const optionsHash = JSON.stringify(options || {});

    // Normalize prompt (trim and lowercase for consistency)
    const normalizedPrompt = prompt.trim().toLowerCase();

    return `${CACHE_PREFIX}${blockType}:${normalizedPrompt}:${contextHash}:${optionsHash}`;
}

/**
 * Get all cache keys for a specific course
 */
function getCourseCacheKeys(courseId: string): string[] {
    const keys: string[] = [];

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed: CachedContent = JSON.parse(data);
                    if (parsed.courseId === courseId) {
                        keys.push(key);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed to get course cache keys:', error);
    }

    return keys;
}

/**
 * Evict least recently used entries if course cache exceeds max size
 */
function evictLRUIfNeeded(courseId: string): void {
    try {
        const keys = getCourseCacheKeys(courseId);

        if (keys.length >= MAX_ENTRIES_PER_COURSE) {
            // Sort by lastAccessed timestamp (oldest first)
            const entries = keys.map(key => {
                const data = localStorage.getItem(key);
                if (!data) return null;

                const parsed: CachedContent = JSON.parse(data);
                return { key, lastAccessed: parsed.lastAccessed };
            }).filter(Boolean) as { key: string; lastAccessed: number }[];

            entries.sort((a, b) => a.lastAccessed - b.lastAccessed);

            // Remove oldest entries to make room
            const entriesToRemove = entries.length - MAX_ENTRIES_PER_COURSE + 1;
            for (let i = 0; i < entriesToRemove; i++) {
                localStorage.removeItem(entries[i].key);
            }
        }
    } catch (error) {
        console.error('Failed to evict LRU entries:', error);
    }
}

/**
 * Get cache statistics
 */
function getCacheStats(): CacheStats {
    try {
        const stats = localStorage.getItem(STATS_KEY);
        if (stats) {
            return JSON.parse(stats);
        }
    } catch (error) {
        console.error('Failed to get cache stats:', error);
    }

    return { hits: 0, misses: 0, totalRequests: 0 };
}

/**
 * Update cache statistics
 */
function updateCacheStats(isHit: boolean): void {
    try {
        const stats = getCacheStats();
        stats.totalRequests++;

        if (isHit) {
            stats.hits++;
        } else {
            stats.misses++;
        }

        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Failed to update cache stats:', error);
    }
}

/**
 * AI Content Cache API
 */
export const aiContentCache = {
    /**
     * Get cached content if available and not expired
     */
    get(
        blockType: BlockType,
        prompt: string,
        context: CourseContext,
        options?: GenerationOptions
    ): any | null {
        try {
            const key = generateCacheKey(blockType, prompt, context, options);
            const cached = localStorage.getItem(key);

            if (!cached) {
                updateCacheStats(false);
                return null;
            }

            const parsed: CachedContent = JSON.parse(cached);

            // Check if cache has expired
            if (Date.now() - parsed.timestamp > CACHE_EXPIRY_MS) {
                localStorage.removeItem(key);
                updateCacheStats(false);
                return null;
            }

            // Update last accessed time
            parsed.lastAccessed = Date.now();
            localStorage.setItem(key, JSON.stringify(parsed));

            updateCacheStats(true);
            return parsed.content;
        } catch (error) {
            console.error('Failed to get cached content:', error);
            updateCacheStats(false);
            return null;
        }
    },

    /**
     * Cache generated content
     */
    set(
        blockType: BlockType,
        prompt: string,
        context: CourseContext,
        content: any,
        options?: GenerationOptions
    ): void {
        try {
            // Evict LRU entries if needed before adding new entry
            evictLRUIfNeeded(context.courseId);

            const key = generateCacheKey(blockType, prompt, context, options);
            const cacheEntry: CachedContent = {
                content,
                timestamp: Date.now(),
                lastAccessed: Date.now(),
                blockType,
                courseId: context.courseId,
            };

            localStorage.setItem(key, JSON.stringify(cacheEntry));
        } catch (error) {
            console.error('Failed to cache content:', error);
        }
    },

    /**
     * Clear all cached content for a specific course
     */
    clearCourse(courseId: string): void {
        try {
            const keys = getCourseCacheKeys(courseId);
            keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Failed to clear course cache:', error);
        }
    },

    /**
     * Clear all expired cache entries across all courses
     */
    clearExpired(): void {
        try {
            const now = Date.now();

            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith(CACHE_PREFIX)) {
                    try {
                        const data = localStorage.getItem(key);
                        if (data) {
                            const parsed: CachedContent = JSON.parse(data);
                            if (now - parsed.timestamp > CACHE_EXPIRY_MS) {
                                localStorage.removeItem(key);
                            }
                        }
                    } catch (error) {
                        // If parsing fails, remove the corrupted entry
                        localStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to clear expired cache:', error);
        }
    },

    /**
     * Get cache statistics including hit rate
     */
    getStats(): CacheStats & { hitRate: number } {
        const stats = getCacheStats();
        const hitRate = stats.totalRequests > 0
            ? (stats.hits / stats.totalRequests) * 100
            : 0;

        return {
            ...stats,
            hitRate: Math.round(hitRate * 100) / 100, // Round to 2 decimal places
        };
    },

    /**
     * Reset cache statistics
     */
    resetStats(): void {
        try {
            localStorage.setItem(STATS_KEY, JSON.stringify({
                hits: 0,
                misses: 0,
                totalRequests: 0,
            }));
        } catch (error) {
            console.error('Failed to reset cache stats:', error);
        }
    },

    /**
     * Get the number of cached entries for a course
     */
    getCourseEntryCount(courseId: string): number {
        return getCourseCacheKeys(courseId).length;
    },

    /**
     * Check if content is cached
     */
    has(
        blockType: BlockType,
        prompt: string,
        context: CourseContext,
        options?: GenerationOptions
    ): boolean {
        try {
            const key = generateCacheKey(blockType, prompt, context, options);
            const cached = localStorage.getItem(key);

            if (!cached) {
                return false;
            }

            const parsed: CachedContent = JSON.parse(cached);

            // Check if cache has expired
            if (Date.now() - parsed.timestamp > CACHE_EXPIRY_MS) {
                localStorage.removeItem(key);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Failed to check cache:', error);
            return false;
        }
    },
};
