/**
 * Database Performance Monitor
 * Provides real-time query performance monitoring and automatic index recommendations
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';
import { DatabaseMetrics } from './metrics';
import { DatabaseQueryOptimizer, QueryAnalysis, IndexRecommendation } from './query-optimizer';

export interface PerformanceAlert {
  id: string;
  type: 'slow_query' | 'index_missing' | 'table_scan' | 'high_memory' | 'connection_spike' | 'error_rate';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  collection?: string;
  query?: any;
  metrics: {
    duration?: number;
    documentsExamined?: number;
    documentsReturned?: number;
    memoryUsage?: number;
    errorRate?: number;
  };
  recommendation?: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface PerformanceThresholds {
  slowQueryMs: number;
  tableScansPerHour: number;
  errorRatePercent: number;
  memoryUsagePercent: number;
  connectionUtilizationPercent: number;
  indexEfficiencyPercent: number;
}

export interface PerformanceReport {
  timestamp: Date;
  summary: {
    totalQueries: number;
    slowQueries: number;
    errorRate: number;
    averageResponseTime: number;
    indexHitRate: number;
    cacheHitRate: number;
    alertCount: number;
  };
  collections: Array<{
    name: string;
    queryCount: number;
    averageQueryTime: number;
    slowQueryCount: number;
    indexRecommendations: number;
    issues: string[];
  }>;
  topSlowQueries: Array<{
    collection: string;
    query: any;
    duration: number;
    frequency: number;
    recommendation?: string;
  }>;
  indexRecommendations: IndexRecommendation[];
  alerts: PerformanceAlert[];
  trends: {
    queryVolume: Array<{ timestamp: Date; count: number }>;
    responseTime: Array<{ timestamp: Date; average: number }>;
    errorRate: Array<{ timestamp: Date; rate: number }>;
  };
}

export class DatabasePerformanceMonitor {
  private mongoose: typeof mongoose;
  private metrics: DatabaseMetrics;
  private optimizer: DatabaseQueryOptimizer;
  private thresholds: PerformanceThresholds;
  private alerts: Map<string, PerformanceAlert> = new Map();
  private intervalId?: NodeJS.Timeout;
  private isRunning = false;
  private queryHistory: Array<{
    timestamp: Date;
    collection: string;
    operation: string;
    duration: number;
    success: boolean;
    query?: any;
    analysis?: QueryAnalysis;
  }> = [];

  constructor(mongoose: typeof mongoose, metrics: DatabaseMetrics) {
    this.mongoose = mongoose;
    this.metrics = metrics;
    this.optimizer = new DatabaseQueryOptimizer(mongoose);
    
    this.thresholds = {
      slowQueryMs: 1000,
      tableScansPerHour: 10,
      errorRatePercent: 2,
      memoryUsagePercent: 80,
      connectionUtilizationPercent: 85,
      indexEfficiencyPercent: 90,
    };
  }

  start(intervalMs = 30000): void {
    if (this.isRunning) {
      logger.warn('Performance monitor is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting database performance monitor', { interval: intervalMs });

    // Start monitoring queries
    this.setupQueryInterception();

    // Start periodic analysis
    this.intervalId = setInterval(() => {
      this.performAnalysis().catch(error => {
        logger.error('Performance analysis error:', error);
      });
    }, intervalMs);

    // Initial analysis
    this.performAnalysis().catch(error => {
      logger.error('Initial performance analysis error:', error);
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

    logger.info('Stopped database performance monitor');
  }

  private setupQueryInterception(): void {
    // Extend the existing query instrumentation from DatabaseMetrics
    const originalExec = mongoose.Query.prototype.exec;

    mongoose.Query.prototype.exec = async function(this: any) {
      const startTime = Date.now();
      const collection = this.model?.collection?.name || 'unknown';
      const operation = this.op || 'unknown';
      const query = this.getQuery ? this.getQuery() : {};

      try {
        const result = await originalExec.call(this);
        const duration = Date.now() - startTime;

        // Record in performance monitor
        DatabasePerformanceMonitor.instance?.recordQuery({
          timestamp: new Date(startTime),
          collection,
          operation,
          duration,
          success: true,
          query,
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        // Record failed query
        DatabasePerformanceMonitor.instance?.recordQuery({
          timestamp: new Date(startTime),
          collection,
          operation,
          duration,
          success: false,
          query,
        });

        throw error;
      }
    };
  }

  private static instance: DatabasePerformanceMonitor;

  static setInstance(instance: DatabasePerformanceMonitor): void {
    DatabasePerformanceMonitor.instance = instance;
  }

  private recordQuery(queryInfo: {
    timestamp: Date;
    collection: string;
    operation: string;
    duration: number;
    success: boolean;
    query?: any;
  }): void {
    this.queryHistory.push(queryInfo);

    // Keep only last 10000 queries
    if (this.queryHistory.length > 10000) {
      this.queryHistory = this.queryHistory.slice(-10000);
    }

    // Check for immediate performance issues
    this.checkQueryPerformance(queryInfo).catch(error => {
      logger.error('Query performance check error:', error);
    });
  }

  private async checkQueryPerformance(queryInfo: {
    timestamp: Date;
    collection: string;
    operation: string;
    duration: number;
    success: boolean;
    query?: any;
  }): Promise<void> {
    // Check for slow queries
    if (queryInfo.duration > this.thresholds.slowQueryMs) {
      await this.createSlowQueryAlert(queryInfo);
    }

    // Analyze query if it's a read operation
    if (queryInfo.operation === 'find' || queryInfo.operation === 'findOne') {
      try {
        const analysis = await this.optimizer.analyzeQuery(
          queryInfo.collection,
          queryInfo.query || {}
        );

        // Update query info with analysis
        const historyEntry = this.queryHistory[this.queryHistory.length - 1];
        if (historyEntry) {
          historyEntry.analysis = analysis;
        }

        // Check for table scans
        const hasTableScan = analysis.issues.some(issue => issue.type === 'table_scan');
        if (hasTableScan) {
          await this.createTableScanAlert(queryInfo, analysis);
        }

        // Check for missing indexes
        const hasMissingIndex = analysis.issues.some(issue => issue.type === 'missing_index');
        if (hasMissingIndex) {
          await this.createMissingIndexAlert(queryInfo, analysis);
        }

      } catch (error) {
        logger.debug('Query analysis failed:', error);
      }
    }
  }

  private async createSlowQueryAlert(queryInfo: {
    timestamp: Date;
    collection: string;
    operation: string;
    duration: number;
    success: boolean;
    query?: any;
  }): Promise<void> {
    const alertId = `slow_query_${queryInfo.collection}_${Date.now()}`;
    
    const severity = queryInfo.duration > 5000 ? 'critical' : 
                    queryInfo.duration > 2000 ? 'high' : 'medium';

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'slow_query',
      severity,
      title: `Slow ${queryInfo.operation} query detected`,
      description: `Query on collection "${queryInfo.collection}" took ${queryInfo.duration}ms to execute`,
      collection: queryInfo.collection,
      query: queryInfo.query,
      metrics: {
        duration: queryInfo.duration,
      },
      recommendation: 'Consider adding appropriate indexes or optimizing the query structure',
      timestamp: queryInfo.timestamp,
      resolved: false,
    };

    this.alerts.set(alertId, alert);
    logger.warn(`Performance alert created: ${alert.title}`, {
      collection: queryInfo.collection,
      duration: queryInfo.duration,
    });
  }

  private async createTableScanAlert(
    queryInfo: any,
    analysis: QueryAnalysis
  ): Promise<void> {
    const alertId = `table_scan_${queryInfo.collection}_${Date.now()}`;

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'table_scan',
      severity: 'high',
      title: 'Full collection scan detected',
      description: `Query is performing a full collection scan on "${queryInfo.collection}"`,
      collection: queryInfo.collection,
      query: queryInfo.query,
      metrics: {
        duration: queryInfo.duration,
        documentsExamined: analysis.metrics.documentsExamined,
        documentsReturned: analysis.metrics.documentsReturned,
      },
      recommendation: 'Create an appropriate index for the query fields',
      timestamp: queryInfo.timestamp,
      resolved: false,
    };

    this.alerts.set(alertId, alert);
  }

  private async createMissingIndexAlert(
    queryInfo: any,
    analysis: QueryAnalysis
  ): Promise<void> {
    const alertId = `missing_index_${queryInfo.collection}_${Date.now()}`;

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'index_missing',
      severity: 'medium',
      title: 'Missing index detected',
      description: `Query could benefit from an index on collection "${queryInfo.collection}"`,
      collection: queryInfo.collection,
      query: queryInfo.query,
      metrics: {
        duration: queryInfo.duration,
        documentsExamined: analysis.metrics.documentsExamined,
      },
      recommendation: 'Consider creating an index for frequently queried fields',
      timestamp: queryInfo.timestamp,
      resolved: false,
    };

    this.alerts.set(alertId, alert);
  }

  private async performAnalysis(): Promise<void> {
    try {
      // Analyze recent performance trends
      await this.analyzeTrends();

      // Check system thresholds
      await this.checkSystemThresholds();

      // Generate index recommendations
      await this.generateIndexRecommendations();

      // Clean up old data
      this.cleanup();

      logger.debug('Performance analysis completed', {
        alerts: this.alerts.size,
        queries: this.queryHistory.length,
      });

    } catch (error) {
      logger.error('Performance analysis failed:', error);
    }
  }

  private async analyzeTrends(): Promise<void> {
    const now = Date.now();
    const recentQueries = this.queryHistory.filter(q => 
      now - q.timestamp.getTime() < 3600000 // last hour
    );

    // Analyze error rate trend
    const errorQueries = recentQueries.filter(q => !q.success);
    const errorRate = recentQueries.length > 0 
      ? (errorQueries.length / recentQueries.length) * 100 
      : 0;

    if (errorRate > this.thresholds.errorRatePercent) {
      await this.createErrorRateAlert(errorRate);
    }

    // Analyze query volume spikes
    const currentHourVolume = recentQueries.length;
    const previousHourQueries = this.queryHistory.filter(q => 
      now - q.timestamp.getTime() >= 3600000 && 
      now - q.timestamp.getTime() < 7200000 // previous hour
    );
    
    const previousHourVolume = previousHourQueries.length;
    
    if (currentHourVolume > previousHourVolume * 2 && previousHourVolume > 0) {
      await this.createConnectionSpikeAlert(currentHourVolume, previousHourVolume);
    }
  }

  private async checkSystemThresholds(): Promise<void> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return;

      // Check memory usage
      const serverStatus = await db.admin().serverStatus();
      if (serverStatus.mem) {
        const memoryUsage = serverStatus.mem.resident || 0;
        // This would need system memory information to calculate percentage
        // For now, we'll use a basic check
        if (memoryUsage > 1000) { // > 1GB
          await this.createHighMemoryAlert(memoryUsage);
        }
      }

    } catch (error) {
      logger.debug('System threshold check failed:', error);
    }
  }

  private async generateIndexRecommendations(): Promise<void> {
    const collections = [...new Set(this.queryHistory.map(q => q.collection))];
    
    for (const collection of collections) {
      try {
        const recommendations = await this.optimizer.generateIndexRecommendations(collection);
        
        // Create alerts for high-impact recommendations
        for (const recommendation of recommendations) {
          if (recommendation.impact === 'high') {
            await this.createIndexRecommendationAlert(recommendation);
          }
        }
      } catch (error) {
        logger.debug(`Index recommendation failed for ${collection}:`, error);
      }
    }
  }

  private async createErrorRateAlert(errorRate: number): Promise<void> {
    const alertId = `error_rate_${Date.now()}`;

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'error_rate',
      severity: errorRate > 10 ? 'critical' : 'high',
      title: 'High error rate detected',
      description: `Database error rate is ${errorRate.toFixed(1)}%`,
      metrics: {
        errorRate,
      },
      recommendation: 'Investigate recent queries and database connectivity issues',
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);
  }

  private async createConnectionSpikeAlert(current: number, previous: number): Promise<void> {
    const alertId = `connection_spike_${Date.now()}`;

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'connection_spike',
      severity: 'medium',
      title: 'Query volume spike detected',
      description: `Query volume increased from ${previous} to ${current} queries per hour`,
      metrics: {},
      recommendation: 'Monitor application behavior and consider connection pooling adjustments',
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);
  }

  private async createHighMemoryAlert(memoryUsage: number): Promise<void> {
    const alertId = `high_memory_${Date.now()}`;

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'high_memory',
      severity: memoryUsage > 2000 ? 'critical' : 'high',
      title: 'High memory usage detected',
      description: `Database memory usage is ${memoryUsage}MB`,
      metrics: {
        memoryUsage,
      },
      recommendation: 'Consider optimizing queries, adding indexes, or scaling database resources',
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);
  }

  private async createIndexRecommendationAlert(recommendation: IndexRecommendation): Promise<void> {
    const alertId = `index_rec_${recommendation.collection}_${Date.now()}`;

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'index_missing',
      severity: 'medium',
      title: 'Index recommendation available',
      description: `High-impact index recommended for collection "${recommendation.collection}"`,
      collection: recommendation.collection,
      recommendation: `Create index: ${recommendation.createStatement}`,
      timestamp: new Date(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);
  }

  /**
   * Generate comprehensive performance report
   */
  async generateReport(): Promise<PerformanceReport> {
    const now = Date.now();
    const recentQueries = this.queryHistory.filter(q => 
      now - q.timestamp.getTime() < 3600000 // last hour
    );

    const slowQueries = recentQueries.filter(q => q.duration > this.thresholds.slowQueryMs);
    const errorQueries = recentQueries.filter(q => !q.success);
    const errorRate = recentQueries.length > 0 
      ? (errorQueries.length / recentQueries.length) * 100 
      : 0;

    const averageResponseTime = recentQueries.length > 0
      ? recentQueries.reduce((sum, q) => sum + q.duration, 0) / recentQueries.length
      : 0;

    // Calculate index hit rate
    const queriesWithAnalysis = recentQueries.filter(q => q.analysis);
    const indexHitRate = queriesWithAnalysis.length > 0
      ? (queriesWithAnalysis.filter(q => q.analysis?.metrics.indexHit).length / queriesWithAnalysis.length) * 100
      : 0;

    // Collection analysis
    const collectionStats = new Map<string, {
      queryCount: number;
      totalTime: number;
      slowQueries: number;
    }>();

    recentQueries.forEach(q => {
      const current = collectionStats.get(q.collection) || { queryCount: 0, totalTime: 0, slowQueries: 0 };
      collectionStats.set(q.collection, {
        queryCount: current.queryCount + 1,
        totalTime: current.totalTime + q.duration,
        slowQueries: current.slowQueries + (q.duration > this.thresholds.slowQueryMs ? 1 : 0),
      });
    });

    const collections = Array.from(collectionStats.entries()).map(([name, stats]) => ({
      name,
      queryCount: stats.queryCount,
      averageQueryTime: stats.totalTime / stats.queryCount,
      slowQueryCount: stats.slowQueries,
      indexRecommendations: 0, // Would need to calculate
      issues: [] as string[],
    }));

    // Top slow queries
    const topSlowQueries = slowQueries
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map(q => ({
        collection: q.collection,
        query: q.query,
        duration: q.duration,
        frequency: recentQueries.filter(rq => 
          rq.collection === q.collection && 
          JSON.stringify(rq.query) === JSON.stringify(q.query)
        ).length,
      }));

    // Get index recommendations
    const allRecommendations: IndexRecommendation[] = [];
    for (const collection of [...new Set(recentQueries.map(q => q.collection))]) {
      try {
        const recommendations = await this.optimizer.generateIndexRecommendations(collection);
        allRecommendations.push(...recommendations);
      } catch (error) {
        logger.debug(`Failed to get recommendations for ${collection}:`, error);
      }
    }

    // Generate trends
    const trends = this.generateTrends();

    return {
      timestamp: new Date(),
      summary: {
        totalQueries: recentQueries.length,
        slowQueries: slowQueries.length,
        errorRate,
        averageResponseTime,
        indexHitRate,
        cacheHitRate: 0, // Would need cache metrics
        alertCount: this.getActiveAlerts().length,
      },
      collections,
      topSlowQueries,
      indexRecommendations: allRecommendations,
      alerts: this.getActiveAlerts(),
      trends,
    };
  }

  private generateTrends(): PerformanceReport['trends'] {
    const now = Date.now();
    const intervals = 12; // 12 intervals of 5 minutes each = 1 hour
    const intervalSize = 300000; // 5 minutes

    const queryVolume: Array<{ timestamp: Date; count: number }> = [];
    const responseTime: Array<{ timestamp: Date; average: number }> = [];
    const errorRate: Array<{ timestamp: Date; rate: number }> = [];

    for (let i = intervals - 1; i >= 0; i--) {
      const intervalEnd = now - (i * intervalSize);
      const intervalStart = intervalEnd - intervalSize;
      
      const intervalQueries = this.queryHistory.filter(q => 
        q.timestamp.getTime() >= intervalStart && 
        q.timestamp.getTime() < intervalEnd
      );

      const intervalErrors = intervalQueries.filter(q => !q.success);
      const avgResponseTime = intervalQueries.length > 0
        ? intervalQueries.reduce((sum, q) => sum + q.duration, 0) / intervalQueries.length
        : 0;
      const intervalErrorRate = intervalQueries.length > 0
        ? (intervalErrors.length / intervalQueries.length) * 100
        : 0;

      queryVolume.push({
        timestamp: new Date(intervalEnd),
        count: intervalQueries.length,
      });

      responseTime.push({
        timestamp: new Date(intervalEnd),
        average: avgResponseTime,
      });

      errorRate.push({
        timestamp: new Date(intervalEnd),
        rate: intervalErrorRate,
      });
    }

    return {
      queryVolume,
      responseTime,
      errorRate,
    };
  }

  /**
   * Get active performance alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  /**
   * Get all performance alerts
   */
  getAllAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Resolve a performance alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      logger.info(`Performance alert resolved: ${alert.title}`);
      return true;
    }
    return false;
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    logger.info('Performance thresholds updated:', newThresholds);
  }

  /**
   * Get current performance thresholds
   */
  getThresholds(): PerformanceThresholds {
    return { ...this.thresholds };
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    // Clean up old queries
    this.queryHistory = this.queryHistory.filter(q => 
      now - q.timestamp.getTime() < maxAge
    );

    // Clean up old alerts
    const oldAlerts = Array.from(this.alerts.entries()).filter(([_, alert]) => 
      alert.resolved && alert.resolvedAt && 
      now - alert.resolvedAt.getTime() > maxAge
    );

    oldAlerts.forEach(([id, _]) => {
      this.alerts.delete(id);
    });
  }
}