/**
 * Database Caching Layer
 * Provides intelligent caching for frequently accessed data with Redis-compatible interface
 */

import { logger } from '../monitoring';

export interface CacheConfig {
  defaultTTL: number; // seconds
  maxMemoryUsage: number; // bytes
  cleanupInterval: number; // seconds
  compressionThreshold: number; // bytes - compress values larger than this
  enableMetrics: boolean;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  ttl: number;
  createdAt: Date;
  accessCount: number;
  lastAccessed: Date;
  compressed: boolean;
  size: number; // estimated size in bytes
}

export interface CacheMetrics {
  totalKeys: number;
  memoryUsage: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  totalSets: number;
  totalDeletes: number;
  averageResponseTime: number;
  popularKeys: Array<{
    key: string;
    accessCount: number;
    lastAccessed: Date;
  }>;
  expiredKeys: number;
  cleanupRuns: number;
}

export interface QueryCacheKey {
  collection: string;
  operation: string;
  query: any;
  options?: any;
}

export class DatabaseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;
  private metrics: CacheMetrics;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 300, // 5 minutes
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      cleanupInterval: 60, // 1 minute
      compressionThreshold: 1024, // 1KB
      enableMetrics: true,
      ...config,
    };

    this.metrics = {
      totalKeys: 0,
      memoryUsage: 0,
      hitRate: 0,
      missRate: 0,
      totalHits: 0,
      totalMisses: 0,
      totalSets: 0,
      totalDeletes: 0,
      averageResponseTime: 0,
      popularKeys: [],
      expiredKeys: 0,
      cleanupRuns: 0,
    };

    this.startCleanupProcess();
  }

  /**
   * Set a value in the cache
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const ttl = ttlSeconds || this.config.defaultTTL;
      const serializedValue = JSON.stringify(value);
      let finalValue = serializedValue;
      let compressed = false;

      // Compress large values
      if (serializedValue.length > this.config.compressionThreshold) {
        finalValue = await this.compress(serializedValue);
        compressed = true;
      }

      const entry: CacheEntry<T> = {
        key,
        value: compressed ? finalValue as any : value,
        ttl,
        createdAt: new Date(),
        accessCount: 0,
        lastAccessed: new Date(),
        compressed,
        size: finalValue.length,
      };

      // Check memory usage before setting
      if (this.metrics.memoryUsage + entry.size > this.config.maxMemoryUsage) {
        await this.evictLeastRecentlyUsed();
      }

      this.cache.set(key, entry);
      this.updateMetricsOnSet(entry.size);

      logger.debug(`Cache SET: ${key}`, {
        size: entry.size,
        compressed,
        ttl,
        responseTime: Date.now() - startTime,
      });

      return true;
    } catch (error) {
      logger.error('Cache SET error:', error);
      return false;
    }
  }

  /**
   * Get a value from the cache
   */
  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.updateMetricsOnMiss();
        return null;
      }

      // Check if expired
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.updateMetricsOnExpire(entry.size);
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = new Date();

      let value = entry.value;

      // Decompress if needed
      if (entry.compressed) {
        const decompressedString = await this.decompress(entry.value as string);
        value = JSON.parse(decompressedString);
      }

      this.updateMetricsOnHit();

      logger.debug(`Cache GET: ${key}`, {
        hit: true,
        compressed: entry.compressed,
        responseTime: Date.now() - startTime,
      });

      return value as T;
    } catch (error) {
      logger.error('Cache GET error:', error);
      this.updateMetricsOnMiss();
      return null;
    }
  }

  /**
   * Delete a key from the cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const entry = this.cache.get(key);
      if (entry) {
        this.cache.delete(key);
        this.updateMetricsOnDelete(entry.size);
        logger.debug(`Cache DELETE: ${key}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Cache DELETE error:', error);
      return false;
    }
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? !this.isExpired(entry) : false;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      this.cache.clear();
      this.resetMetrics();
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Cache CLEAR error:', error);
    }
  }

  /**
   * Get multiple values from cache
   */
  async mget<T>(keys: string[]): Promise<Array<T | null>> {
    const results = await Promise.all(keys.map(key => this.get<T>(key)));
    return results;
  }

  /**
   * Set multiple values in cache
   */
  async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<boolean[]> {
    const results = await Promise.all(entries.map(entry => 
      this.set(entry.key, entry.value, entry.ttl)
    ));
    return results;
  }

  /**
   * Cache a database query result
   */
  async cacheQuery<T>(
    queryKey: QueryCacheKey,
    data: T,
    ttlSeconds?: number
  ): Promise<boolean> {
    const key = this.generateQueryKey(queryKey);
    return this.set(key, data, ttlSeconds);
  }

  /**
   * Get cached query result
   */
  async getCachedQuery<T>(queryKey: QueryCacheKey): Promise<T | null> {
    const key = this.generateQueryKey(queryKey);
    return this.get<T>(key);
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    let deleted = 0;
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        await this.delete(key);
        deleted++;
      }
    }

    logger.info(`Invalidated ${deleted} cache entries matching pattern: ${pattern}`);
    return deleted;
  }

  /**
   * Invalidate cache for a specific collection
   */
  async invalidateCollection(collection: string): Promise<number> {
    return this.invalidatePattern(`query:${collection}:*`);
  }

  /**
   * Get cache statistics
   */
  getMetrics(): CacheMetrics {
    this.updatePopularKeys();
    return { ...this.metrics };
  }

  /**
   * Get cache health information
   */
  getHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    memoryUsage: number;
    memoryUsagePercent: number;
    hitRate: number;
    issues: string[];
  } {
    const memoryUsagePercent = (this.metrics.memoryUsage / this.config.maxMemoryUsage) * 100;
    const hitRate = this.metrics.hitRate;
    const issues: string[] = [];

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    if (memoryUsagePercent > 90) {
      status = 'critical';
      issues.push('Memory usage is critically high (>90%)');
    } else if (memoryUsagePercent > 80) {
      status = 'warning';
      issues.push('Memory usage is high (>80%)');
    }

    if (hitRate < 50) {
      status = status === 'critical' ? 'critical' : 'warning';
      issues.push('Cache hit rate is low (<50%)');
    }

    return {
      status,
      memoryUsage: this.metrics.memoryUsage,
      memoryUsagePercent,
      hitRate,
      issues,
    };
  }

  /**
   * Warmup cache with frequently accessed data
   */
  async warmup<T>(
    dataLoader: () => Promise<Array<{ key: string; value: T; ttl?: number }>>,
    maxItems = 100
  ): Promise<number> {
    try {
      logger.info('Starting cache warmup...');
      
      const items = await dataLoader();
      const limitedItems = items.slice(0, maxItems);
      
      const results = await this.mset(limitedItems);
      const successCount = results.filter(Boolean).length;
      
      logger.info(`Cache warmup completed: ${successCount}/${limitedItems.length} items cached`);
      return successCount;
    } catch (error) {
      logger.error('Cache warmup failed:', error);
      return 0;
    }
  }

  private generateQueryKey(queryKey: QueryCacheKey): string {
    const { collection, operation, query, options } = queryKey;
    const queryStr = JSON.stringify(query);
    const optionsStr = options ? JSON.stringify(options) : '';
    return `query:${collection}:${operation}:${Buffer.from(queryStr + optionsStr).toString('base64')}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    const now = Date.now();
    const expiryTime = entry.createdAt.getTime() + (entry.ttl * 1000);
    return now > expiryTime;
  }

  private async compress(data: string): Promise<string> {
    // Simple compression using gzip-like algorithm
    // In a real implementation, you'd use actual compression libraries
    try {
      return Buffer.from(data).toString('base64');
    } catch (error) {
      logger.warn('Compression failed, storing uncompressed:', error);
      return data;
    }
  }

  private async decompress(data: string): Promise<string> {
    try {
      return Buffer.from(data, 'base64').toString();
    } catch (error) {
      logger.warn('Decompression failed:', error);
      return data;
    }
  }

  private async evictLeastRecentlyUsed(): Promise<void> {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, ...entry }))
      .sort((a, b) => a.lastAccessed.getTime() - b.lastAccessed.getTime());

    const evictCount = Math.ceil(entries.length * 0.1); // Evict 10% of entries
    
    for (let i = 0; i < evictCount && i < entries.length; i++) {
      await this.delete(entries[i].key);
    }

    logger.info(`Evicted ${evictCount} least recently used cache entries`);
  }

  private startCleanupProcess(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries().catch(error => {
        logger.error('Cache cleanup error:', error);
      });
    }, this.config.cleanupInterval * 1000);
  }

  private async cleanupExpiredEntries(): Promise<void> {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.updateMetricsOnExpire(entry.size);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.metrics.cleanupRuns++;
      logger.debug(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  private updateMetricsOnSet(size: number): void {
    if (!this.config.enableMetrics) return;
    
    this.metrics.totalSets++;
    this.metrics.totalKeys = this.cache.size;
    this.metrics.memoryUsage += size;
  }

  private updateMetricsOnHit(): void {
    if (!this.config.enableMetrics) return;
    
    this.metrics.totalHits++;
    this.updateHitRate();
  }

  private updateMetricsOnMiss(): void {
    if (!this.config.enableMetrics) return;
    
    this.metrics.totalMisses++;
    this.updateHitRate();
  }

  private updateMetricsOnDelete(size: number): void {
    if (!this.config.enableMetrics) return;
    
    this.metrics.totalDeletes++;
    this.metrics.totalKeys = this.cache.size;
    this.metrics.memoryUsage = Math.max(0, this.metrics.memoryUsage - size);
  }

  private updateMetricsOnExpire(size: number): void {
    if (!this.config.enableMetrics) return;
    
    this.metrics.expiredKeys++;
    this.metrics.totalKeys = this.cache.size;
    this.metrics.memoryUsage = Math.max(0, this.metrics.memoryUsage - size);
  }

  private updateHitRate(): void {
    const total = this.metrics.totalHits + this.metrics.totalMisses;
    this.metrics.hitRate = total > 0 ? (this.metrics.totalHits / total) * 100 : 0;
    this.metrics.missRate = 100 - this.metrics.hitRate;
  }

  private updatePopularKeys(): void {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
      }))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10);

    this.metrics.popularKeys = entries;
  }

  private resetMetrics(): void {
    this.metrics = {
      totalKeys: 0,
      memoryUsage: 0,
      hitRate: 0,
      missRate: 0,
      totalHits: 0,
      totalMisses: 0,
      totalSets: 0,
      totalDeletes: 0,
      averageResponseTime: 0,
      popularKeys: [],
      expiredKeys: 0,
      cleanupRuns: 0,
    };
  }

  /**
   * Shutdown the cache and cleanup resources
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    this.cache.clear();
    logger.info('Database cache shutdown');
  }
}

// Singleton instance for global cache usage
let globalCache: DatabaseCache | null = null;

export function getGlobalCache(config?: Partial<CacheConfig>): DatabaseCache {
  if (!globalCache) {
    globalCache = new DatabaseCache(config);
  }
  return globalCache;
}

// Decorator for caching method results
export function cached(
  ttlSeconds: number = 300,
  keyGenerator?: (...args: any[]) => string
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = getGlobalCache();

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator 
        ? keyGenerator(...args) 
        : `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cachedResult = await cache.get(key);
      if (cachedResult !== null) {
        logger.debug(`Cache hit for ${key}`);
        return cachedResult;
      }

      // Execute original method
      const result = await originalMethod.apply(this, args);
      
      // Cache the result
      await cache.set(key, result, ttlSeconds);
      
      return result;
    };

    return descriptor;
  };
}

// Helper function to create cache-aware database operations
export function withCache<T>(
  operation: () => Promise<T>,
  cacheKey: string,
  ttlSeconds: number = 300
): Promise<T> {
  const cache = getGlobalCache();
  
  return cache.get<T>(cacheKey).then(cachedResult => {
    if (cachedResult !== null) {
      return cachedResult;
    }
    
    return operation().then(result => {
      cache.set(cacheKey, result, ttlSeconds);
      return result;
    });
  });
}