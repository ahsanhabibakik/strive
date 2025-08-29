/**
 * Database Metrics Collection
 * Provides detailed database performance metrics and analytics
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';

export interface QueryMetric {
  id: string;
  collection: string;
  operation: 'find' | 'findOne' | 'insert' | 'update' | 'delete' | 'aggregate' | 'count';
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
  query?: any;
  result?: {
    matched?: number;
    modified?: number;
    inserted?: number;
    deleted?: number;
  };
  indexes?: {
    used: string[];
    suggested: string[];
  };
}

export interface CollectionMetric {
  name: string;
  documents: number;
  avgObjSize: number;
  storageSize: number;
  indexes: Array<{
    name: string;
    size: number;
    usage: {
      ops: number;
      since: Date;
    };
  }>;
  operations: {
    insert: number;
    query: number;
    update: number;
    remove: number;
  };
  performance: {
    avgQueryTime: number;
    slowQueries: number;
  };
}

export interface PerformanceMetric {
  timestamp: Date;
  cpu: {
    usage: number;
    iowait: number;
  };
  memory: {
    resident: number;
    virtual: number;
    mapped: number;
    cache: number;
  };
  storage: {
    reads: number;
    writes: number;
    queueDepth: number;
    utilization: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    requestsIn: number;
    requestsOut: number;
  };
  connections: {
    active: number;
    queued: number;
    total: number;
  };
}

export interface DatabaseMetricsData {
  queries: QueryMetric[];
  collections: CollectionMetric[];
  performance: PerformanceMetric[];
  summary: {
    totalQueries: number;
    averageQueryTime: number;
    errorRate: number;
    slowQueryRate: number;
    topCollections: Array<{
      name: string;
      queryCount: number;
      avgTime: number;
    }>;
    topSlowQueries: QueryMetric[];
    indexRecommendations: Array<{
      collection: string;
      field: string;
      reason: string;
      impact: 'high' | 'medium' | 'low';
    }>;
  };
}

export class DatabaseMetrics {
  private mongoose: typeof mongoose;
  private intervalId?: NodeJS.Timeout;
  private isRunning = false;
  private queryMetrics: QueryMetric[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private collectionMetrics: Map<string, CollectionMetric> = new Map();
  private queryIdCounter = 0;

  constructor(mongoose: typeof mongoose) {
    this.mongoose = mongoose;
  }

  start(intervalMs = 60000): void {
    if (this.isRunning) {
      logger.warn('Database metrics collector is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting database metrics collection', { interval: intervalMs });

    // Setup query instrumentation
    this.setupQueryInstrumentation();

    // Start periodic metrics collection
    this.intervalId = setInterval(() => {
      this.collectPerformanceMetrics().catch((error) => {
        logger.error('Error collecting performance metrics:', error);
      });
      this.collectCollectionMetrics().catch((error) => {
        logger.error('Error collecting collection metrics:', error);
      });
    }, intervalMs);

    // Initial collection
    this.collectPerformanceMetrics().catch((error) => {
      logger.error('Error in initial performance metrics collection:', error);
    });
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    logger.info('Stopped database metrics collection');
  }

  private setupQueryInstrumentation(): void {
    // Instrument mongoose queries
    const originalExec = mongoose.Query.prototype.exec;
    
    mongoose.Query.prototype.exec = async function(this: any) {
      const startTime = Date.now();
      const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        const result = await originalExec.call(this);
        const duration = Date.now() - startTime;
        
        // Record successful query metric
        const metric = DatabaseMetrics.instance?.recordQueryMetric({
          id: queryId,
          collection: this.model?.collection?.name || 'unknown',
          operation: this.op || 'unknown',
          duration,
          timestamp: new Date(startTime),
          success: true,
          query: this.getQuery ? this.getQuery() : {},
          result: DatabaseMetrics.instance?.extractQueryResult(result),
        });

        if (metric) {
          DatabaseMetrics.instance?.analyzeQuery(metric);
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        // Record failed query metric
        DatabaseMetrics.instance?.recordQueryMetric({
          id: queryId,
          collection: this.model?.collection?.name || 'unknown',
          operation: this.op || 'unknown',
          duration,
          timestamp: new Date(startTime),
          success: false,
          error: (error as Error).message,
          query: this.getQuery ? this.getQuery() : {},
        });

        throw error;
      }
    };
  }

  private static instance: DatabaseMetrics;

  static setInstance(instance: DatabaseMetrics): void {
    DatabaseMetrics.instance = instance;
  }

  private recordQueryMetric(metric: Omit<QueryMetric, 'indexes'>): QueryMetric {
    const fullMetric: QueryMetric = {
      ...metric,
      indexes: { used: [], suggested: [] },
    };

    this.queryMetrics.push(fullMetric);

    // Keep only last 10000 queries
    if (this.queryMetrics.length > 10000) {
      this.queryMetrics = this.queryMetrics.slice(-10000);
    }

    // Log slow queries
    if (metric.duration > 1000) {
      logger.warn(`Slow query detected: ${metric.operation} on ${metric.collection}`, {
        duration: metric.duration,
        query: metric.query,
      });
    }

    return fullMetric;
  }

  private extractQueryResult(result: any): QueryMetric['result'] {
    if (!result) return undefined;

    if (result.matchedCount !== undefined) {
      return {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      };
    }

    if (result.insertedCount !== undefined) {
      return {
        inserted: result.insertedCount,
      };
    }

    if (result.deletedCount !== undefined) {
      return {
        deleted: result.deletedCount,
      };
    }

    return undefined;
  }

  private analyzeQuery(metric: QueryMetric): void {
    // Analyze query for potential optimizations
    const suggestions: string[] = [];

    // Check for missing indexes on commonly queried fields
    if (metric.operation === 'find' || metric.operation === 'findOne') {
      const query = metric.query || {};
      const queryFields = Object.keys(query);

      for (const field of queryFields) {
        // This is a simplified check - in reality, you'd query the database
        // to check if proper indexes exist
        if (field !== '_id' && !field.startsWith('$')) {
          suggestions.push(field);
        }
      }
    }

    metric.indexes = {
      used: [], // Would need to extract from explain plan
      suggested: suggestions,
    };
  }

  private async collectPerformanceMetrics(): Promise<void> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return;

      const serverStatus = await db.admin().serverStatus();
      
      const metric: PerformanceMetric = {
        timestamp: new Date(),
        cpu: {
          usage: 0, // Would need OS-level monitoring
          iowait: 0,
        },
        memory: {
          resident: serverStatus.mem?.resident || 0,
          virtual: serverStatus.mem?.virtual || 0,
          mapped: serverStatus.mem?.mapped || 0,
          cache: 0,
        },
        storage: {
          reads: serverStatus.extra_info?.page_faults || 0,
          writes: 0,
          queueDepth: 0,
          utilization: 0,
        },
        network: {
          bytesIn: serverStatus.network?.bytesIn || 0,
          bytesOut: serverStatus.network?.bytesOut || 0,
          requestsIn: serverStatus.network?.numRequests || 0,
          requestsOut: 0,
        },
        connections: {
          active: serverStatus.connections?.current || 0,
          queued: 0,
          total: serverStatus.connections?.totalCreated || 0,
        },
      };

      this.performanceMetrics.push(metric);

      // Keep only last 1000 performance metrics (approximately 16 hours at 1 minute intervals)
      if (this.performanceMetrics.length > 1000) {
        this.performanceMetrics = this.performanceMetrics.slice(-1000);
      }

    } catch (error) {
      logger.warn('Could not collect performance metrics:', error);
    }
  }

  private async collectCollectionMetrics(): Promise<void> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return;

      const collections = await db.listCollections().toArray();

      for (const collection of collections) {
        try {
          const coll = db.collection(collection.name);
          const stats = await coll.stats();
          const indexes = await coll.listIndexes().toArray();

          // Calculate operation counts from recent queries
          const recentQueries = this.queryMetrics.filter(q => 
            q.collection === collection.name &&
            Date.now() - q.timestamp.getTime() < 3600000 // last hour
          );

          const operations = {
            insert: recentQueries.filter(q => q.operation === 'insert').length,
            query: recentQueries.filter(q => q.operation === 'find' || q.operation === 'findOne').length,
            update: recentQueries.filter(q => q.operation === 'update').length,
            remove: recentQueries.filter(q => q.operation === 'delete').length,
          };

          const queryTimes = recentQueries.map(q => q.duration);
          const avgQueryTime = queryTimes.length > 0 
            ? queryTimes.reduce((sum, time) => sum + time, 0) / queryTimes.length
            : 0;
          
          const slowQueries = recentQueries.filter(q => q.duration > 1000).length;

          const collectionMetric: CollectionMetric = {
            name: collection.name,
            documents: stats.count || 0,
            avgObjSize: stats.avgObjSize || 0,
            storageSize: stats.storageSize || 0,
            indexes: indexes.map(index => ({
              name: index.name,
              size: 0, // Would need to get from $indexStats
              usage: {
                ops: 0, // Would need to track index usage
                since: new Date(),
              },
            })),
            operations,
            performance: {
              avgQueryTime,
              slowQueries,
            },
          };

          this.collectionMetrics.set(collection.name, collectionMetric);

        } catch (error) {
          logger.debug(`Could not collect metrics for collection ${collection.name}:`, error);
        }
      }

    } catch (error) {
      logger.warn('Could not collect collection metrics:', error);
    }
  }

  getMetrics(): DatabaseMetricsData {
    const now = Date.now();
    const recentQueries = this.queryMetrics.filter(q => 
      now - q.timestamp.getTime() < 3600000 // last hour
    );

    const totalQueries = recentQueries.length;
    const successfulQueries = recentQueries.filter(q => q.success);
    const failedQueries = recentQueries.filter(q => !q.success);
    const slowQueries = recentQueries.filter(q => q.duration > 1000);

    const averageQueryTime = totalQueries > 0 
      ? recentQueries.reduce((sum, q) => sum + q.duration, 0) / totalQueries
      : 0;

    const errorRate = totalQueries > 0 
      ? (failedQueries.length / totalQueries) * 100
      : 0;

    const slowQueryRate = totalQueries > 0 
      ? (slowQueries.length / totalQueries) * 100
      : 0;

    // Top collections by query count
    const collectionQueryCounts = new Map<string, { count: number; totalTime: number }>();
    recentQueries.forEach(q => {
      const current = collectionQueryCounts.get(q.collection) || { count: 0, totalTime: 0 };
      collectionQueryCounts.set(q.collection, {
        count: current.count + 1,
        totalTime: current.totalTime + q.duration,
      });
    });

    const topCollections = Array.from(collectionQueryCounts.entries())
      .map(([name, data]) => ({
        name,
        queryCount: data.count,
        avgTime: data.totalTime / data.count,
      }))
      .sort((a, b) => b.queryCount - a.queryCount)
      .slice(0, 10);

    // Top slow queries
    const topSlowQueries = slowQueries
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 20);

    // Index recommendations
    const indexRecommendations = this.generateIndexRecommendations();

    return {
      queries: this.queryMetrics,
      collections: Array.from(this.collectionMetrics.values()),
      performance: this.performanceMetrics,
      summary: {
        totalQueries,
        averageQueryTime,
        errorRate,
        slowQueryRate,
        topCollections,
        topSlowQueries,
        indexRecommendations,
      },
    };
  }

  private generateIndexRecommendations(): Array<{
    collection: string;
    field: string;
    reason: string;
    impact: 'high' | 'medium' | 'low';
  }> {
    const recommendations: Array<{
      collection: string;
      field: string;
      reason: string;
      impact: 'high' | 'medium' | 'low';
    }> = [];

    // Analyze slow queries for potential index improvements
    const slowQueries = this.queryMetrics.filter(q => q.duration > 1000 && q.success);
    const fieldUsage = new Map<string, { count: number; avgDuration: number; collections: Set<string> }>();

    slowQueries.forEach(query => {
      if (query.query && typeof query.query === 'object') {
        Object.keys(query.query).forEach(field => {
          if (field !== '_id' && !field.startsWith('$')) {
            const key = `${query.collection}.${field}`;
            const current = fieldUsage.get(key) || { count: 0, avgDuration: 0, collections: new Set() };
            
            fieldUsage.set(key, {
              count: current.count + 1,
              avgDuration: (current.avgDuration * current.count + query.duration) / (current.count + 1),
              collections: current.collections.add(query.collection),
            });
          }
        });
      }
    });

    // Generate recommendations based on field usage
    fieldUsage.forEach((usage, key) => {
      const [collection, field] = key.split('.');
      
      if (usage.count >= 5 && usage.avgDuration > 500) {
        recommendations.push({
          collection,
          field,
          reason: `Field "${field}" is frequently queried (${usage.count} times) with slow average response time (${Math.round(usage.avgDuration)}ms)`,
          impact: usage.avgDuration > 2000 ? 'high' : usage.avgDuration > 1000 ? 'medium' : 'low',
        });
      }
    });

    return recommendations.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  // Get specific metrics
  getQueryMetrics(collection?: string, timeRangeMs = 3600000): QueryMetric[] {
    const now = Date.now();
    return this.queryMetrics.filter(q => 
      now - q.timestamp.getTime() < timeRangeMs &&
      (collection ? q.collection === collection : true)
    );
  }

  getSlowQueries(thresholdMs = 1000, limit = 50): QueryMetric[] {
    return this.queryMetrics
      .filter(q => q.duration > thresholdMs)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  getCollectionMetrics(collection?: string): CollectionMetric | CollectionMetric[] {
    if (collection) {
      return this.collectionMetrics.get(collection) || null;
    }
    return Array.from(this.collectionMetrics.values());
  }

  getPerformanceHistory(timeRangeMs = 3600000): PerformanceMetric[] {
    const cutoff = Date.now() - timeRangeMs;
    return this.performanceMetrics.filter(p => p.timestamp.getTime() > cutoff);
  }

  // Export metrics for external monitoring systems
  exportMetrics(format: 'json' | 'prometheus' = 'json') {
    const metrics = this.getMetrics();
    
    if (format === 'prometheus') {
      return this.toPrometheusFormat(metrics);
    }
    
    return metrics;
  }

  private toPrometheusFormat(metrics: DatabaseMetricsData): string {
    const lines: string[] = [];
    
    // Query metrics
    lines.push('# HELP mongodb_queries_total Total number of queries');
    lines.push('# TYPE mongodb_queries_total counter');
    lines.push(`mongodb_queries_total ${metrics.summary.totalQueries}`);
    
    lines.push('# HELP mongodb_query_duration_ms Average query duration in milliseconds');
    lines.push('# TYPE mongodb_query_duration_ms gauge');
    lines.push(`mongodb_query_duration_ms ${metrics.summary.averageQueryTime}`);
    
    lines.push('# HELP mongodb_query_error_rate Query error rate percentage');
    lines.push('# TYPE mongodb_query_error_rate gauge');
    lines.push(`mongodb_query_error_rate ${metrics.summary.errorRate}`);

    // Collection metrics
    metrics.collections.forEach(collection => {
      lines.push(`mongodb_collection_documents{collection="${collection.name}"} ${collection.documents}`);
      lines.push(`mongodb_collection_storage_size{collection="${collection.name}"} ${collection.storageSize}`);
      lines.push(`mongodb_collection_avg_query_time{collection="${collection.name}"} ${collection.performance.avgQueryTime}`);
    });

    return lines.join('\n');
  }

  // Clear old metrics to prevent memory leaks
  cleanup(retentionDays = 7): void {
    const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    this.queryMetrics = this.queryMetrics.filter(q => q.timestamp.getTime() > cutoff);
    this.performanceMetrics = this.performanceMetrics.filter(p => p.timestamp.getTime() > cutoff);
    
    logger.info(`Cleaned up metrics older than ${retentionDays} days`);
  }
}