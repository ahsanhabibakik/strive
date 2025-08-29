/**
 * Database Optimization Suite
 * Comprehensive database optimization and monitoring system
 */

export { DatabaseHealthMonitor } from './health-monitor';
export type { HealthStats, HealthAlert, HealthThresholds } from './health-monitor';

export { DatabaseMetrics } from './metrics';
export type { QueryMetric, CollectionMetric, PerformanceMetric, DatabaseMetricsData } from './metrics';

export { DatabaseQueryOptimizer } from './query-optimizer';
export type { QueryPlan, QueryOptimization, IndexRecommendation, QueryAnalysis } from './query-optimizer';

export { DatabaseCache, getGlobalCache, cached, withCache } from './cache';
export type { CacheConfig, CacheEntry, CacheMetrics, QueryCacheKey } from './cache';

export { ReplicaManager } from './replica-manager';
export type { ReplicaConfig, ReplicaSetConfig, ConnectionStats, LoadBalancerStats } from './replica-manager';

export { DatabasePerformanceMonitor } from './performance-monitor';
export type { PerformanceAlert, PerformanceThresholds, PerformanceReport } from './performance-monitor';

export { DatabaseDashboardAnalytics } from './dashboard-analytics';
export type { DashboardData, HistoricalData, AlertSummary } from './dashboard-analytics';

export { DatabaseBackupManager } from './backup-manager';
export type { BackupConfig, BackupMetadata, BackupHealth, MaintenanceTask, MaintenanceReport } from './backup-manager';

/**
 * Database Optimization Manager
 * Main class that orchestrates all database optimization features
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';
import { DatabaseHealthMonitor } from './health-monitor';
import { DatabaseMetrics } from './metrics';
import { DatabasePerformanceMonitor } from './performance-monitor';
import { DatabaseDashboardAnalytics } from './dashboard-analytics';
import { DatabaseCache } from './cache';
import { DatabaseBackupManager, BackupConfig } from './backup-manager';
import { ReplicaManager, ReplicaSetConfig } from './replica-manager';

export interface DatabaseOptimizationConfig {
  health: {
    enabled: boolean;
    checkInterval: number;
  };
  metrics: {
    enabled: boolean;
    collectInterval: number;
  };
  performance: {
    enabled: boolean;
    monitorInterval: number;
  };
  cache: {
    enabled: boolean;
    maxMemory: number;
    defaultTTL: number;
  };
  backup: {
    enabled: boolean;
    config?: BackupConfig;
  };
  replica: {
    enabled: boolean;
    config?: ReplicaSetConfig;
  };
}

export class DatabaseOptimizationSuite {
  private mongoose: typeof mongoose;
  private config: DatabaseOptimizationConfig;
  
  private healthMonitor?: DatabaseHealthMonitor;
  private metrics?: DatabaseMetrics;
  private performanceMonitor?: DatabasePerformanceMonitor;
  private dashboardAnalytics?: DatabaseDashboardAnalytics;
  private cache?: DatabaseCache;
  private backupManager?: DatabaseBackupManager;
  private replicaManager?: ReplicaManager;
  
  private isStarted = false;

  constructor(mongoose: typeof mongoose, config: DatabaseOptimizationConfig) {
    this.mongoose = mongoose;
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.isStarted) {
      logger.warn('Database optimization suite is already started');
      return;
    }

    try {
      logger.info('Starting database optimization suite...');

      // Initialize cache first as other components may use it
      if (this.config.cache.enabled) {
        this.cache = new DatabaseCache({
          maxMemoryUsage: this.config.cache.maxMemory,
          defaultTTL: this.config.cache.defaultTTL,
        });
        logger.info('Database cache initialized');
      }

      // Initialize replica manager if configured
      if (this.config.replica.enabled && this.config.replica.config) {
        this.replicaManager = new ReplicaManager(this.config.replica.config);
        logger.info('Replica manager initialized');
      }

      // Initialize metrics collection
      if (this.config.metrics.enabled) {
        this.metrics = new DatabaseMetrics(this.mongoose);
        this.metrics.start(this.config.metrics.collectInterval);
        
        // Set global instance for query instrumentation
        DatabaseMetrics.setInstance(this.metrics);
        logger.info('Database metrics collection started');
      }

      // Initialize health monitoring
      if (this.config.health.enabled) {
        this.healthMonitor = new DatabaseHealthMonitor(this.mongoose);
        this.healthMonitor.start(this.config.health.checkInterval);
        logger.info('Database health monitoring started');
      }

      // Initialize performance monitoring
      if (this.config.performance.enabled && this.metrics) {
        this.performanceMonitor = new DatabasePerformanceMonitor(this.mongoose, this.metrics);
        this.performanceMonitor.start(this.config.performance.monitorInterval);
        
        // Set global instance for query instrumentation
        DatabasePerformanceMonitor.setInstance(this.performanceMonitor);
        logger.info('Database performance monitoring started');
      }

      // Initialize backup manager
      if (this.config.backup.enabled && this.config.backup.config) {
        this.backupManager = new DatabaseBackupManager(this.mongoose, this.config.backup.config);
        logger.info('Database backup manager initialized');
      }

      // Initialize dashboard analytics
      this.dashboardAnalytics = new DatabaseDashboardAnalytics(this.mongoose);
      this.dashboardAnalytics.setMonitors({
        health: this.healthMonitor,
        metrics: this.metrics,
        performance: this.performanceMonitor,
        replica: this.replicaManager,
        cache: this.cache,
      });
      logger.info('Database dashboard analytics initialized');

      this.isStarted = true;
      logger.info('Database optimization suite started successfully');

    } catch (error) {
      logger.error('Failed to start database optimization suite:', error);
      await this.stop(); // Clean up any partially initialized components
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isStarted) {
      return;
    }

    logger.info('Stopping database optimization suite...');

    try {
      // Stop all components
      if (this.performanceMonitor) {
        this.performanceMonitor.stop();
        this.performanceMonitor = undefined;
      }

      if (this.healthMonitor) {
        this.healthMonitor.stop();
        this.healthMonitor = undefined;
      }

      if (this.metrics) {
        this.metrics.stop();
        this.metrics = undefined;
      }

      if (this.dashboardAnalytics) {
        this.dashboardAnalytics.shutdown();
        this.dashboardAnalytics = undefined;
      }

      if (this.cache) {
        this.cache.shutdown();
        this.cache = undefined;
      }

      if (this.backupManager) {
        this.backupManager.shutdown();
        this.backupManager = undefined;
      }

      if (this.replicaManager) {
        await this.replicaManager.shutdown();
        this.replicaManager = undefined;
      }

      this.isStarted = false;
      logger.info('Database optimization suite stopped successfully');

    } catch (error) {
      logger.error('Error stopping database optimization suite:', error);
      throw error;
    }
  }

  // Getter methods for accessing components
  getHealthMonitor(): DatabaseHealthMonitor | undefined {
    return this.healthMonitor;
  }

  getMetrics(): DatabaseMetrics | undefined {
    return this.metrics;
  }

  getPerformanceMonitor(): DatabasePerformanceMonitor | undefined {
    return this.performanceMonitor;
  }

  getDashboardAnalytics(): DatabaseDashboardAnalytics | undefined {
    return this.dashboardAnalytics;
  }

  getCache(): DatabaseCache | undefined {
    return this.cache;
  }

  getBackupManager(): DatabaseBackupManager | undefined {
    return this.backupManager;
  }

  getReplicaManager(): ReplicaManager | undefined {
    return this.replicaManager;
  }

  // Convenience methods for common operations
  async generateDashboard(): Promise<any> {
    if (!this.dashboardAnalytics) {
      throw new Error('Dashboard analytics not initialized');
    }
    return this.dashboardAnalytics.generateDashboardData();
  }

  async getSystemHealth(): Promise<any> {
    if (!this.healthMonitor) {
      throw new Error('Health monitor not initialized');
    }
    return {
      score: this.healthMonitor.getHealthScore(),
      status: this.healthMonitor.getStatus(),
      stats: this.healthMonitor.getHealthStats(),
      alerts: this.healthMonitor.getAlerts(),
    };
  }

  async getPerformanceReport(): Promise<any> {
    if (!this.performanceMonitor) {
      throw new Error('Performance monitor not initialized');
    }
    return this.performanceMonitor.generateReport();
  }

  async getCacheMetrics(): Promise<any> {
    if (!this.cache) {
      throw new Error('Cache not initialized');
    }
    return {
      metrics: this.cache.getMetrics(),
      health: this.cache.getHealth(),
    };
  }

  // Status and configuration methods
  isRunning(): boolean {
    return this.isStarted;
  }

  getConfig(): DatabaseOptimizationConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<DatabaseOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('Database optimization suite configuration updated');
  }
}

// Default configuration
export const defaultOptimizationConfig: DatabaseOptimizationConfig = {
  health: {
    enabled: true,
    checkInterval: 30000, // 30 seconds
  },
  metrics: {
    enabled: true,
    collectInterval: 60000, // 1 minute
  },
  performance: {
    enabled: true,
    monitorInterval: 30000, // 30 seconds
  },
  cache: {
    enabled: true,
    maxMemory: 100 * 1024 * 1024, // 100MB
    defaultTTL: 300, // 5 minutes
  },
  backup: {
    enabled: false, // Disabled by default, requires configuration
  },
  replica: {
    enabled: false, // Disabled by default, requires configuration
  },
};

// Global instance for easy access
let globalOptimizationSuite: DatabaseOptimizationSuite | null = null;

export function initializeDatabaseOptimization(
  mongoose: typeof mongoose,
  config: Partial<DatabaseOptimizationConfig> = {}
): DatabaseOptimizationSuite {
  const finalConfig = { ...defaultOptimizationConfig, ...config };
  globalOptimizationSuite = new DatabaseOptimizationSuite(mongoose, finalConfig);
  return globalOptimizationSuite;
}

export function getDatabaseOptimizationSuite(): DatabaseOptimizationSuite | null {
  return globalOptimizationSuite;
}