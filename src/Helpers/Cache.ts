export type CacheEntry<T> = {
    [key: string]: { data: T; timestamp: number };
  };
  
  export const saveCacheToLocalStorage = <T>(
    key: string,
    cache: CacheEntry<T>
  ) => {
    try {
      localStorage.setItem(key, JSON.stringify(cache));
    } catch (e) {
      console.error(`Failed to save cache to ${key}`, e);
    }
  };
  
  export const loadCacheFromLocalStorage = <T>(key: string): CacheEntry<T> => {
    const cacheString = localStorage.getItem(key);
    if (!cacheString) return {};
  
    try {
      return JSON.parse(cacheString) as CacheEntry<T>;
    } catch (error) {
      console.error(`Failed to parse cache from ${key}`, error);
      return {};
    }
  };
  