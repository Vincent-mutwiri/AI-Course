interface CacheEntry {
  response: string;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const cache = new Map<string, CacheEntry>();

export const aiCache = {
  get(key: string): string | null {
    const entry = cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return null;
    }
    
    return entry.response;
  },
  
  set(key: string, response: string): void {
    cache.set(key, {
      response,
      timestamp: Date.now()
    });
  },
  
  generateKey(generatorType: string, userInput: string, options?: any): string {
    return `${generatorType}:${userInput}:${JSON.stringify(options || {})}`;
  }
};
