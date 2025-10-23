// Cache configuration and management
import { cacheService, CACHE_KEYS, CACHE_TTL } from './cacheService';
import { cookieService, COOKIE_KEYS, COOKIE_OPTIONS } from './cookieService';

// Cache management utilities
export class CacheManager {
  // Clear all caches
  static clearAllCaches(): void {
    try {
      cacheService.clear();
      console.log('🧹 All caches cleared');
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }
  }

  // Clear specific cache types
  static clearProductCaches(): void {
    try {
      cacheService.remove(CACHE_KEYS.PRODUCTS);
      // Clear individual product caches
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_KEYS.PRODUCT)) {
          cacheService.remove(key);
        }
      });
      console.log('📦 Product caches cleared');
    } catch (error) {
      console.warn('Failed to clear product caches:', error);
    }
  }

  static clearOrderCaches(): void {
    try {
      cacheService.remove(CACHE_KEYS.ORDERS);
      console.log('📋 Order caches cleared');
    } catch (error) {
      console.warn('Failed to clear order caches:', error);
    }
  }

  static clearUserCaches(): void {
    try {
      cacheService.remove(CACHE_KEYS.USERS);
      // Clear individual user caches
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_KEYS.USER)) {
          cacheService.remove(key);
        }
      });
      console.log('👤 User caches cleared');
    } catch (error) {
      console.warn('Failed to clear user caches:', error);
    }
  }

  static clearStatsCache(): void {
    try {
      cacheService.remove(CACHE_KEYS.STATS);
      console.log('📊 Stats cache cleared');
    } catch (error) {
      console.warn('Failed to clear stats cache:', error);
    }
  }

  // Get cache statistics
  static getCacheStats(): {
    cache: ReturnType<typeof cacheService.getStats>;
    storage: {
      localStorage: number;
      sessionStorage: number;
      cookies: number;
    };
  } {
    const cacheStats = cacheService.getStats();
    
    let cookieCount = 0;
    try {
      const cookies = cookieService.getAll();
      cookieCount = Object.keys(cookies).length;
    } catch (error) {
      console.warn('Failed to count cookies:', error);
    }

    return {
      cache: cacheStats,
      storage: {
        localStorage: cacheStats.localStorage,
        sessionStorage: cacheStats.sessionStorage,
        cookies: cookieCount
      }
    };
  }

  // Optimize cache (remove expired items)
  static optimizeCache(): void {
    try {
      cacheService.cleanup();
      console.log('🧹 Cache optimized (expired items removed)');
    } catch (error) {
      console.warn('Failed to optimize cache:', error);
    }
  }

  // Check if cache is healthy
  static isCacheHealthy(): boolean {
    try {
      const stats = this.getCacheStats();
      const totalItems = stats.cache.memory + stats.cache.localStorage + stats.cache.sessionStorage;
      
      // Consider cache healthy if total items < 1000 and no errors
      return totalItems < 1000;
    } catch (error) {
      console.warn('Cache health check failed:', error);
      return false;
    }
  }

  // Export cache data for backup
  static exportCacheData(): string {
    try {
      const data: Record<string, any> = {};
      
      // Export localStorage cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          const item = localStorage.getItem(key);
          if (item) {
            data[key] = JSON.parse(item);
          }
        }
      });

      // Export sessionStorage cache
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          const item = sessionStorage.getItem(key);
          if (item) {
            data[key] = JSON.parse(item);
          }
        }
      });

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.warn('Failed to export cache data:', error);
      return '{}';
    }
  }

  // Import cache data from backup
  static importCacheData(data: string): boolean {
    try {
      const parsedData = JSON.parse(data);
      
      Object.entries(parsedData).forEach(([key, value]) => {
        if (key.startsWith('cache_')) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });

      console.log('📥 Cache data imported successfully');
      return true;
    } catch (error) {
      console.warn('Failed to import cache data:', error);
      return false;
    }
  }
}

// Cache performance monitoring
export class CacheMonitor {
  private static performanceMetrics: {
    hits: number;
    misses: number;
    totalRequests: number;
    averageResponseTime: number;
  } = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    averageResponseTime: 0
  };

  static recordCacheHit(responseTime: number): void {
    this.performanceMetrics.hits++;
    this.performanceMetrics.totalRequests++;
    this.updateAverageResponseTime(responseTime);
  }

  static recordCacheMiss(responseTime: number): void {
    this.performanceMetrics.misses++;
    this.performanceMetrics.totalRequests++;
    this.updateAverageResponseTime(responseTime);
  }

  private static updateAverageResponseTime(responseTime: number): void {
    const total = this.performanceMetrics.hits + this.performanceMetrics.misses;
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime * (total - 1) + responseTime) / total;
  }

  static getPerformanceMetrics() {
    const hitRate = this.performanceMetrics.totalRequests > 0 
      ? (this.performanceMetrics.hits / this.performanceMetrics.totalRequests) * 100 
      : 0;

    return {
      ...this.performanceMetrics,
      hitRate: Math.round(hitRate * 100) / 100
    };
  }

  static resetMetrics(): void {
    this.performanceMetrics = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      averageResponseTime: 0
    };
  }
}

// Auto-cleanup configuration
export const CACHE_CLEANUP_CONFIG = {
  // Run cleanup every 10 minutes
  cleanupInterval: 10 * 60 * 1000,
  // Maximum cache size before cleanup
  maxCacheSize: 1000,
  // Maximum age for cache items (24 hours)
  maxCacheAge: 24 * 60 * 60 * 1000
};

// Initialize auto-cleanup
let cleanupInterval: NodeJS.Timeout | null = null;

export const startAutoCleanup = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }

  cleanupInterval = setInterval(() => {
    try {
      CacheManager.optimizeCache();
      
      // Check if cache is getting too large
      const stats = CacheManager.getCacheStats();
      const totalItems = stats.cache.memory + stats.cache.localStorage + stats.cache.sessionStorage;
      
      if (totalItems > CACHE_CLEANUP_CONFIG.maxCacheSize) {
        console.log('🧹 Cache size exceeded limit, performing cleanup');
        CacheManager.clearAllCaches();
      }
    } catch (error) {
      console.warn('Auto-cleanup failed:', error);
    }
  }, CACHE_CLEANUP_CONFIG.cleanupInterval);
};

export const stopAutoCleanup = (): void => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};

// Start auto-cleanup on module load
startAutoCleanup();
