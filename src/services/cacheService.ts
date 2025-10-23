// Cache service for managing localStorage, sessionStorage, and memory cache
export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
  storage?: 'localStorage' | 'sessionStorage' | 'memory';
}

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheItem>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_MAX_SIZE = 100;

  // Generic cache operations
  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const ttl = config.ttl || this.DEFAULT_TTL;
    const maxSize = config.maxSize || this.DEFAULT_MAX_SIZE;
    const storage = config.storage || 'localStorage';

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    try {
      switch (storage) {
        case 'memory':
          this.setMemoryCache(key, cacheItem, maxSize);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, JSON.stringify(cacheItem));
          break;
        case 'localStorage':
        default:
          localStorage.setItem(key, JSON.stringify(cacheItem));
          break;
      }
    } catch (error) {
      console.warn('Cache set failed:', error);
      // Fallback to memory cache
      this.setMemoryCache(key, cacheItem, maxSize);
    }
  }

  get<T>(key: string, config: CacheConfig = {}): T | null {
    const storage = config.storage || 'localStorage';

    try {
      let cacheItem: CacheItem<T> | null = null;

      switch (storage) {
        case 'memory':
          cacheItem = this.memoryCache.get(key) || null;
          break;
        case 'sessionStorage':
          const sessionData = sessionStorage.getItem(key);
          cacheItem = sessionData ? JSON.parse(sessionData) : null;
          break;
        case 'localStorage':
        default:
          const localData = localStorage.getItem(key);
          cacheItem = localData ? JSON.parse(localData) : null;
          break;
      }

      if (!cacheItem) return null;

      // Check if cache is expired
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        this.remove(key, config);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  remove(key: string, config: CacheConfig = {}): void {
    const storage = config.storage || 'localStorage';

    try {
      switch (storage) {
        case 'memory':
          this.memoryCache.delete(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
        case 'localStorage':
        default:
          localStorage.removeItem(key);
          break;
      }
    } catch (error) {
      console.warn('Cache remove failed:', error);
    }
  }

  clear(config: CacheConfig = {}): void {
    const storage = config.storage || 'localStorage';

    try {
      switch (storage) {
        case 'memory':
          this.memoryCache.clear();
          break;
        case 'sessionStorage':
          // Only clear cache-related items
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('cache_')) {
              sessionStorage.removeItem(key);
            }
          });
          break;
        case 'localStorage':
        default:
          // Only clear cache-related items
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
              localStorage.removeItem(key);
            }
          });
          break;
      }
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  }

  // Memory cache specific methods
  private setMemoryCache<T>(key: string, item: CacheItem<T>, maxSize: number): void {
    if (this.memoryCache.size >= maxSize) {
      // Remove oldest item
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }
    this.memoryCache.set(key, item);
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }

    // Clean localStorage
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem = JSON.parse(item);
            if (now - cacheItem.timestamp > cacheItem.ttl) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }

    // Clean sessionStorage
    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          const item = sessionStorage.getItem(key);
          if (item) {
            const cacheItem = JSON.parse(item);
            if (now - cacheItem.timestamp > cacheItem.ttl) {
              sessionStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  // Cache statistics
  getStats(): { memory: number; localStorage: number; sessionStorage: number } {
    let localStorageCount = 0;
    let sessionStorageCount = 0;

    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) localStorageCount++;
      });
    } catch (error) {
      console.warn('Cache stats failed:', error);
    }

    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('cache_')) sessionStorageCount++;
      });
    } catch (error) {
      console.warn('Cache stats failed:', error);
    }

    return {
      memory: this.memoryCache.size,
      localStorage: localStorageCount,
      sessionStorage: sessionStorageCount
    };
  }
}

// Create singleton instance
export const cacheService = new CacheService();

// Auto-cleanup every 10 minutes
setInterval(() => {
  cacheService.cleanup();
}, 10 * 60 * 1000);

// Cache key constants
export const CACHE_KEYS = {
  PRODUCTS: 'cache_products',
  PRODUCT: 'cache_product_',
  ORDERS: 'cache_orders',
  ORDER: 'cache_order_',
  USERS: 'cache_users',
  USER: 'cache_user_',
  STATS: 'cache_stats',
  CART: 'cache_cart',
  AUTH: 'cache_auth'
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  PRODUCTS: 10 * 60 * 1000, // 10 minutes
  PRODUCT: 30 * 60 * 1000, // 30 minutes
  ORDERS: 5 * 60 * 1000, // 5 minutes
  ORDER: 15 * 60 * 1000, // 15 minutes
  USERS: 15 * 60 * 1000, // 15 minutes
  USER: 30 * 60 * 1000, // 30 minutes
  STATS: 5 * 60 * 1000, // 5 minutes
  CART: 24 * 60 * 60 * 1000, // 24 hours
  AUTH: 60 * 60 * 1000 // 1 hour
} as const;
