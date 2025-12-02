import { IPage, IBlock } from '../types/page';

const CACHE_PREFIX = 'page_editor_cache_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedPageData {
    page: Partial<IPage>;
    blocks: IBlock[];
    timestamp: number;
}

/**
 * Save page data to local storage
 */
export function cachePageData(pageId: string, page: Partial<IPage>, blocks: IBlock[]): void {
    try {
        const cacheKey = `${CACHE_PREFIX}${pageId}`;
        const cacheData: CachedPageData = {
            page,
            blocks,
            timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Failed to cache page data:', error);
    }
}

/**
 * Retrieve cached page data from local storage
 */
export function getCachedPageData(pageId: string): CachedPageData | null {
    try {
        const cacheKey = `${CACHE_PREFIX}${pageId}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (!cachedData) {
            return null;
        }

        const parsed: CachedPageData = JSON.parse(cachedData);

        // Check if cache has expired
        if (Date.now() - parsed.timestamp > CACHE_EXPIRY_MS) {
            clearCachedPageData(pageId);
            return null;
        }

        return parsed;
    } catch (error) {
        console.error('Failed to retrieve cached page data:', error);
        return null;
    }
}

/**
 * Clear cached page data
 */
export function clearCachedPageData(pageId: string): void {
    try {
        const cacheKey = `${CACHE_PREFIX}${pageId}`;
        localStorage.removeItem(cacheKey);
    } catch (error) {
        console.error('Failed to clear cached page data:', error);
    }
}

/**
 * Check if there is cached data for a page
 */
export function hasCachedPageData(pageId: string): boolean {
    const cached = getCachedPageData(pageId);
    return cached !== null;
}

/**
 * Clear all expired cache entries
 */
export function clearExpiredCache(): void {
    try {
        const keys = Object.keys(localStorage);
        const now = Date.now();

        keys.forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                try {
                    const data = localStorage.getItem(key);
                    if (data) {
                        const parsed: CachedPageData = JSON.parse(data);
                        if (now - parsed.timestamp > CACHE_EXPIRY_MS) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch (error) {
                    // If parsing fails, remove the corrupted entry
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('Failed to clear expired cache:', error);
    }
}
