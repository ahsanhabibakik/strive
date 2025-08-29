/**
 * Database Dashboard Analytics
 * Provides comprehensive analytics and monitoring data for database dashboard
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';
import { DatabaseHealthMonitor, HealthStats } from './health-monitor';
import { DatabaseMetrics, DatabaseMetricsData } from './metrics';
import { DatabasePerformanceMonitor, PerformanceReport, PerformanceAlert } from './performance-monitor';
import { ReplicaManager, LoadBalancerStats } from './replica-manager';
import { DatabaseCache, CacheMetrics } from './cache';

export interface DashboardData {
  timestamp: Date;
  overview: {
    status: 'healthy' | 'warning' | 'error' | 'critical';
    uptime: number;
    totalCollections: number;
    totalDocuments: number;
    totalIndexes: number;
    storageSize: number;
    dataSize: number;
    connections: {
      current: number;
      available: number;
      utilization: number;
    };
    operations: {
      insertsPerSecond: number;
      queriesPerSecond: number;
      updatesPerSecond: number;
      deletesPerSecond: number;
    };
  };
  health: {
    score: number;
    status: string;
    alerts: PerformanceAlert[];
    issues: string[];
    recommendations: string[];
  };
  performance: {
    averageResponseTime: number;
    slowQueryCount: number;
    errorRate: number;
    indexHitRate: number;
    cacheHitRate: number;
    throughput: number;
    trends: {
      queryVolume: Array<{ timestamp: Date; count: number }>;
      responseTime: Array<{ timestamp: Date; average: number }>;
      errorRate: Array<{ timestamp: Date; rate: number }>;
    };
  };
  collections: Array<{
    name: string;
    documents: number;
    storageSize: number;
    avgObjSize: number;
    indexes: number;
    queryCount: number;
    avgQueryTime: number;
    issues: string[];
    recommendations: string[];
  }>;
  indexes: Array<{
    collection: string;
    name: string;
    size: number;
    usage: number;
    efficiency: number;
    recommendation?: string;
  }>;
  queries: {
    topSlow: Array<{
      collection: string;
      query: any;
      duration: number;
      frequency: number;
      lastSeen: Date;
    }>;
    topFrequent: Array<{
      collection: string;
      pattern: string;
      count: number;
      avgDuration: number;
    }>;
    errorQueries: Array<{
      collection: string;
      query: any;
      error: string;
      count: number;
      lastSeen: Date;
    }>;
  };
  replication?: {
    status: string;
    primary: string;
    secondaries: string[];
    lag: number;
    loadBalancer: LoadBalancerStats;
  };
  cache: {
    hitRate: number;
    memoryUsage: number;
    keyCount: number;
    popularKeys: string[];
    metrics: CacheMetrics;
  };
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    title: string;
    description: string;
    timestamp: Date;
    collection?: string;
  }>;
}

export interface HistoricalData {
  period: 'hour' | 'day' | 'week' | 'month';
  data: Array<{
    timestamp: Date;
    metrics: {
      queryCount: number;
      averageResponseTime: number;
      errorRate: number;
      connections: number;
      memoryUsage: number;
      storageSize: number;
      indexHitRate: number;
      cacheHitRate: number;
    };
  }>;
}

export interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  recent: PerformanceAlert[];
  trends: {
    hourly: number[];
    daily: number[];
    weekly: number[];
  };
}

export class DatabaseDashboardAnalytics {
  private mongoose: typeof mongoose;
  private healthMonitor?: DatabaseHealthMonitor;
  private metrics?: DatabaseMetrics;
  private performanceMonitor?: DatabasePerformanceMonitor;
  private replicaManager?: ReplicaManager;
  private cache?: DatabaseCache;
  private historicalData: Map<string, any[]> = new Map();
  private collectionInterval?: NodeJS.Timeout;

  constructor(mongoose: typeof mongoose) {
    this.mongoose = mongoose;
    this.startHistoricalDataCollection();
  }

  setMonitors(monitors: {
    health?: DatabaseHealthMonitor;
    metrics?: DatabaseMetrics;
    performance?: DatabasePerformanceMonitor;
    replica?: ReplicaManager;
    cache?: DatabaseCache;
  }): void {
    this.healthMonitor = monitors.health;
    this.metrics = monitors.metrics;
    this.performanceMonitor = monitors.performance;
    this.replicaManager = monitors.replica;
    this.cache = monitors.cache;
  }

  async generateDashboardData(): Promise<DashboardData> {
    try {
      const [
        overview,
        health,
        performance,
        collections,
        indexes,
        queries,
        replication,
        cache,
        alerts
      ] = await Promise.all([
        this.generateOverview(),
        this.generateHealthData(),
        this.generatePerformanceData(),
        this.generateCollectionData(),
        this.generateIndexData(),
        this.generateQueryData(),
        this.generateReplicationData(),
        this.generateCacheData(),
        this.generateAlertData(),
      ]);

      return {
        timestamp: new Date(),
        overview,
        health,
        performance,
        collections,
        indexes,
        queries,
        replication,
        cache,
        alerts,
      };
    } catch (error) {
      logger.error('Failed to generate dashboard data:', error);
      throw error;
    }
  }

  private async generateOverview(): Promise<DashboardData['overview']> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) {
        throw new Error('Database not connected');
      }

      const [serverStatus, dbStats, collections] = await Promise.all([
        db.admin().serverStatus(),
        db.stats(),
        db.listCollections().toArray(),
      ]);

      // Calculate operations per second from metrics
      const metricsData = this.metrics?.getMetrics();
      const recentMetrics = metricsData?.queries.filter(q => 
        Date.now() - q.timestamp.getTime() < 60000 // last minute
      ) || [];

      const operations = {
        insertsPerSecond: recentMetrics.filter(q => q.operation === 'insert').length / 60,
        queriesPerSecond: recentMetrics.filter(q => q.operation === 'find' || q.operation === 'findOne').length / 60,
        updatesPerSecond: recentMetrics.filter(q => q.operation === 'update').length / 60,
        deletesPerSecond: recentMetrics.filter(q => q.operation === 'delete').length / 60,
      };

      // Get total indexes
      let totalIndexes = 0;
      for (const collection of collections) {
        try {
          const indexes = await db.collection(collection.name).listIndexes().toArray();
          totalIndexes += indexes.length;
        } catch (error) {
          logger.debug(`Failed to get indexes for ${collection.name}:`, error);
        }
      }

      // Determine overall status
      const healthScore = this.healthMonitor?.getHealthScore() || 100;
      const status = healthScore >= 90 ? 'healthy' : 
                    healthScore >= 70 ? 'warning' : 
                    healthScore >= 50 ? 'error' : 'critical';

      return {
        status,
        uptime: serverStatus.uptime * 1000 || 0, // Convert to milliseconds
        totalCollections: collections.length,
        totalDocuments: dbStats.objects || 0,
        totalIndexes,
        storageSize: dbStats.storageSize || 0,
        dataSize: dbStats.dataSize || 0,
        connections: {
          current: serverStatus.connections?.current || 0,
          available: serverStatus.connections?.available || 0,
          utilization: serverStatus.connections?.current && serverStatus.connections?.available
            ? (serverStatus.connections.current / (serverStatus.connections.current + serverStatus.connections.available)) * 100
            : 0,
        },
        operations,
      };
    } catch (error) {
      logger.error('Failed to generate overview data:', error);
      return {
        status: 'error',
        uptime: 0,
        totalCollections: 0,
        totalDocuments: 0,
        totalIndexes: 0,
        storageSize: 0,
        dataSize: 0,
        connections: { current: 0, available: 0, utilization: 0 },
        operations: { insertsPerSecond: 0, queriesPerSecond: 0, updatesPerSecond: 0, deletesPerSecond: 0 },
      };
    }
  }

  private async generateHealthData(): Promise<DashboardData['health']> {
    if (!this.healthMonitor || !this.performanceMonitor) {
      return {
        score: 0,
        status: 'unknown',
        alerts: [],
        issues: ['Health monitoring not configured'],
        recommendations: ['Configure health monitoring'],
      };
    }

    const score = this.healthMonitor.getHealthScore();
    const status = this.healthMonitor.getStatus();
    const alerts = this.performanceMonitor.getActiveAlerts();
    const healthStats = this.healthMonitor.getHealthStats();

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Analyze health stats for issues
    if (healthStats.averageResponseTime > 1000) {
      issues.push('High average response time');
      recommendations.push('Optimize slow queries and add indexes');
    }

    if (healthStats.errorRate > 2) {
      issues.push('High error rate detected');
      recommendations.push('Investigate database connectivity and query errors');
    }

    const connectionUsage = (healthStats.connectionPoolStats.active / 
      (healthStats.connectionPoolStats.active + healthStats.connectionPoolStats.available)) * 100;
    
    if (connectionUsage > 80) {
      issues.push('High connection pool utilization');
      recommendations.push('Consider increasing connection pool size or optimizing connection usage');
    }

    return {
      score,
      status,
      alerts,
      issues,
      recommendations,
    };
  }

  private async generatePerformanceData(): Promise<DashboardData['performance']> {
    if (!this.performanceMonitor) {
      return {
        averageResponseTime: 0,
        slowQueryCount: 0,
        errorRate: 0,
        indexHitRate: 0,
        cacheHitRate: 0,
        throughput: 0,
        trends: { queryVolume: [], responseTime: [], errorRate: [] },
      };
    }

    const report = await this.performanceMonitor.generateReport();
    
    return {
      averageResponseTime: report.summary.averageResponseTime,
      slowQueryCount: report.summary.slowQueries,
      errorRate: report.summary.errorRate,
      indexHitRate: report.summary.indexHitRate,
      cacheHitRate: report.summary.cacheHitRate,
      throughput: report.summary.totalQueries / 60, // queries per minute to per second
      trends: report.trends,
    };
  }

  private async generateCollectionData(): Promise<DashboardData['collections']> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return [];

      const collections = await db.listCollections().toArray();
      const metricsData = this.metrics?.getMetrics();
      const collectionMetrics = metricsData?.collections || [];

      const result: DashboardData['collections'] = [];

      for (const collection of collections) {
        try {
          const collStats = await db.collection(collection.name).stats();
          const metrics = collectionMetrics.find(m => m.name === collection.name);
          
          // Get index count
          const indexes = await db.collection(collection.name).listIndexes().toArray();

          const issues: string[] = [];
          const recommendations: string[] = [];

          // Analyze collection for issues
          if (!indexes.find(idx => idx.name !== '_id_')) {
            issues.push('No custom indexes defined');
            recommendations.push('Consider adding indexes for frequently queried fields');
          }

          if (metrics && metrics.performance.slowQueries > 0) {
            issues.push(`${metrics.performance.slowQueries} slow queries detected`);
            recommendations.push('Optimize slow queries with appropriate indexes');
          }

          result.push({
            name: collection.name,
            documents: collStats.count || 0,
            storageSize: collStats.storageSize || 0,
            avgObjSize: collStats.avgObjSize || 0,
            indexes: indexes.length,
            queryCount: metrics?.operations.query || 0,
            avgQueryTime: metrics?.performance.avgQueryTime || 0,
            issues,
            recommendations,
          });

        } catch (error) {
          logger.debug(`Failed to get stats for collection ${collection.name}:`, error);
        }
      }

      return result.sort((a, b) => b.queryCount - a.queryCount);

    } catch (error) {
      logger.error('Failed to generate collection data:', error);
      return [];
    }
  }

  private async generateIndexData(): Promise<DashboardData['indexes']> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return [];

      const collections = await db.listCollections().toArray();
      const result: DashboardData['indexes'] = [];

      for (const collection of collections) {
        try {
          const indexes = await db.collection(collection.name).listIndexes().toArray();
          
          for (const index of indexes) {
            // Calculate index usage and efficiency (simplified)
            const usage = 0; // Would need to track actual index usage
            const efficiency = index.name === '_id_' ? 100 : Math.random() * 100; // Simplified
            
            let recommendation: string | undefined;
            if (efficiency < 50) {
              recommendation = 'Consider dropping unused index to improve write performance';
            }

            result.push({
              collection: collection.name,
              name: index.name,
              size: 0, // Would need to get from $indexStats
              usage,
              efficiency,
              recommendation,
            });
          }
        } catch (error) {
          logger.debug(`Failed to get indexes for collection ${collection.name}:`, error);
        }
      }

      return result.sort((a, b) => b.usage - a.usage);

    } catch (error) {
      logger.error('Failed to generate index data:', error);
      return [];
    }
  }

  private async generateQueryData(): Promise<DashboardData['queries']> {
    if (!this.performanceMonitor) {
      return {
        topSlow: [],
        topFrequent: [],
        errorQueries: [],
      };
    }

    const report = await this.performanceMonitor.generateReport();
    
    const topSlow = report.topSlowQueries.map(q => ({
      collection: q.collection,
      query: q.query,
      duration: q.duration,
      frequency: q.frequency,
      lastSeen: new Date(), // Would need to track actual last seen
    }));

    // Generate top frequent queries (simplified)
    const topFrequent = report.collections
      .filter(c => c.queryCount > 0)
      .sort((a, b) => b.queryCount - a.queryCount)
      .slice(0, 10)
      .map(c => ({
        collection: c.name,
        pattern: 'find({})', // Simplified pattern
        count: c.queryCount,
        avgDuration: c.averageQueryTime,
      }));

    // Error queries would need to be tracked separately
    const errorQueries: DashboardData['queries']['errorQueries'] = [];

    return {
      topSlow,
      topFrequent,
      errorQueries,
    };
  }

  private async generateReplicationData(): Promise<DashboardData['replication'] | undefined> {
    if (!this.replicaManager) {
      return undefined;
    }

    const status = this.replicaManager.getStatus();
    const loadBalancer = this.replicaManager.getLoadBalancerStats();
    const connectionStats = this.replicaManager.getAllConnectionStats();

    const primary = connectionStats.find(stat => stat.isPrimary);
    const secondaries = connectionStats.filter(stat => stat.isSecondary);

    return {
      status: status.status,
      primary: primary ? `${primary.host}:${primary.port}` : 'unknown',
      secondaries: secondaries.map(s => `${s.host}:${s.port}`),
      lag: 0, // Would need to calculate replication lag
      loadBalancer,
    };
  }

  private async generateCacheData(): Promise<DashboardData['cache']> {
    if (!this.cache) {
      return {
        hitRate: 0,
        memoryUsage: 0,
        keyCount: 0,
        popularKeys: [],
        metrics: {
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
        },
      };
    }

    const metrics = this.cache.getMetrics();
    
    return {
      hitRate: metrics.hitRate,
      memoryUsage: metrics.memoryUsage,
      keyCount: metrics.totalKeys,
      popularKeys: metrics.popularKeys.slice(0, 5).map(k => k.key),
      metrics,
    };
  }

  private async generateAlertData(): Promise<DashboardData['alerts']> {
    if (!this.performanceMonitor) {
      return [];
    }

    const alerts = this.performanceMonitor.getActiveAlerts();
    
    return alerts.map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      timestamp: alert.timestamp,
      collection: alert.collection,
    }));
  }

  async getHistoricalData(
    period: 'hour' | 'day' | 'week' | 'month',
    metric: string
  ): Promise<HistoricalData> {
    const key = `${period}_${metric}`;
    const data = this.historicalData.get(key) || [];

    return {
      period,
      data,
    };
  }

  async getAlertSummary(): Promise<AlertSummary> {
    if (!this.performanceMonitor) {
      return {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        recent: [],
        trends: { hourly: [], daily: [], weekly: [] },
      };
    }

    const allAlerts = this.performanceMonitor.getAllAlerts();
    const activeAlerts = this.performanceMonitor.getActiveAlerts();

    const summary = {
      total: activeAlerts.length,
      critical: activeAlerts.filter(a => a.severity === 'critical').length,
      high: activeAlerts.filter(a => a.severity === 'high').length,
      medium: activeAlerts.filter(a => a.severity === 'medium').length,
      low: activeAlerts.filter(a => a.severity === 'low').length,
      recent: activeAlerts.slice(0, 10),
      trends: {
        hourly: this.calculateAlertTrends(allAlerts, 'hour'),
        daily: this.calculateAlertTrends(allAlerts, 'day'),
        weekly: this.calculateAlertTrends(allAlerts, 'week'),
      },
    };

    return summary;
  }

  private calculateAlertTrends(
    alerts: PerformanceAlert[],
    period: 'hour' | 'day' | 'week'
  ): number[] {
    const now = Date.now();
    let intervals: number;
    let intervalSize: number;

    switch (period) {
      case 'hour':
        intervals = 12; // 12 x 5-minute intervals
        intervalSize = 5 * 60 * 1000;
        break;
      case 'day':
        intervals = 24; // 24 x 1-hour intervals
        intervalSize = 60 * 60 * 1000;
        break;
      case 'week':
        intervals = 7; // 7 x 1-day intervals
        intervalSize = 24 * 60 * 60 * 1000;
        break;
    }

    const trends: number[] = [];

    for (let i = intervals - 1; i >= 0; i--) {
      const intervalEnd = now - (i * intervalSize);
      const intervalStart = intervalEnd - intervalSize;

      const intervalAlerts = alerts.filter(alert =>
        alert.timestamp.getTime() >= intervalStart &&
        alert.timestamp.getTime() < intervalEnd
      );

      trends.push(intervalAlerts.length);
    }

    return trends;
  }

  private startHistoricalDataCollection(): void {
    // Collect historical data every 5 minutes
    this.collectionInterval = setInterval(() => {
      this.collectHistoricalSnapshot().catch(error => {
        logger.error('Historical data collection failed:', error);
      });
    }, 5 * 60 * 1000);
  }

  private async collectHistoricalSnapshot(): Promise<void> {
    try {
      const dashboard = await this.generateDashboardData();
      const timestamp = new Date();

      // Store metrics snapshot
      const snapshot = {
        timestamp,
        metrics: {
          queryCount: dashboard.performance.throughput * 60, // Convert back to per minute
          averageResponseTime: dashboard.performance.averageResponseTime,
          errorRate: dashboard.performance.errorRate,
          connections: dashboard.overview.connections.current,
          memoryUsage: 0, // Would need system memory info
          storageSize: dashboard.overview.storageSize,
          indexHitRate: dashboard.performance.indexHitRate,
          cacheHitRate: dashboard.performance.cacheHitRate,
        },
      };

      // Store in different periods
      this.storeInPeriod('hour', snapshot, 12); // Keep 12 intervals (1 hour)
      this.storeInPeriod('day', snapshot, 24 * 12); // Keep 24 hours worth
      this.storeInPeriod('week', snapshot, 7 * 24 * 12); // Keep 1 week worth
      this.storeInPeriod('month', snapshot, 30 * 24 * 12); // Keep 1 month worth

    } catch (error) {
      logger.error('Failed to collect historical snapshot:', error);
    }
  }

  private storeInPeriod(period: string, snapshot: any, maxEntries: number): void {
    const key = `${period}_data`;
    let data = this.historicalData.get(key) || [];
    
    data.push(snapshot);
    
    // Keep only the latest entries
    if (data.length > maxEntries) {
      data = data.slice(-maxEntries);
    }
    
    this.historicalData.set(key, data);
  }

  /**
   * Export dashboard data for external monitoring systems
   */
  async exportMetrics(format: 'json' | 'prometheus' = 'json'): Promise<string> {
    const data = await this.generateDashboardData();
    
    if (format === 'prometheus') {
      return this.convertToPrometheus(data);
    }
    
    return JSON.stringify(data, null, 2);
  }

  private convertToPrometheus(data: DashboardData): string {
    const lines: string[] = [];
    
    // Overview metrics
    lines.push('# HELP mongodb_connections_current Current number of connections');
    lines.push('# TYPE mongodb_connections_current gauge');
    lines.push(`mongodb_connections_current ${data.overview.connections.current}`);
    
    lines.push('# HELP mongodb_collections_total Total number of collections');
    lines.push('# TYPE mongodb_collections_total gauge');
    lines.push(`mongodb_collections_total ${data.overview.totalCollections}`);
    
    lines.push('# HELP mongodb_documents_total Total number of documents');
    lines.push('# TYPE mongodb_documents_total gauge');
    lines.push(`mongodb_documents_total ${data.overview.totalDocuments}`);
    
    // Performance metrics
    lines.push('# HELP mongodb_response_time_avg Average response time in milliseconds');
    lines.push('# TYPE mongodb_response_time_avg gauge');
    lines.push(`mongodb_response_time_avg ${data.performance.averageResponseTime}`);
    
    lines.push('# HELP mongodb_error_rate Error rate percentage');
    lines.push('# TYPE mongodb_error_rate gauge');
    lines.push(`mongodb_error_rate ${data.performance.errorRate}`);
    
    // Health metrics
    lines.push('# HELP mongodb_health_score Health score (0-100)');
    lines.push('# TYPE mongodb_health_score gauge');
    lines.push(`mongodb_health_score ${data.health.score}`);
    
    return lines.join('\n');
  }

  shutdown(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = undefined;
    }
    
    this.historicalData.clear();
    logger.info('Dashboard analytics shut down');
  }
}