/**
 * Database Health Monitor
 * Provides comprehensive health monitoring for MongoDB connections
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';

export interface HealthStats {
  uptime: number;
  totalQueries: number;
  averageResponseTime: number;
  errorRate: number;
  connectionPoolStats: {
    active: number;
    available: number;
    created: number;
    destroyed: number;
  };
  memoryUsage: {
    resident: number;
    virtual: number;
    mapped?: number;
  };
  operations: {
    insert: number;
    query: number;
    update: number;
    delete: number;
    getmore: number;
    command: number;
  };
  connections: {
    current: number;
    available: number;
    totalCreated: number;
  };
  replication?: {
    ismaster: boolean;
    secondary: boolean;
    setName?: string;
    setVersion?: number;
    hosts: string[];
  };
  sharding?: {
    configServers: string[];
    shards: Array<{
      id: string;
      host: string;
      state: string;
    }>;
  };
  locks?: {
    timeLockedMicros: {
      r: number;
      w: number;
    };
    timeAcquiringMicros: {
      r: number;
      w: number;
    };
  };
  indexStats: Array<{
    collection: string;
    index: string;
    usage: {
      ops: number;
      since: Date;
    };
  }>;
  slowQueries: Array<{
    ns: string;
    command: any;
    duration: number;
    timestamp: Date;
  }>;
}

export interface HealthAlert {
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  resolved?: Date;
}

export interface HealthThresholds {
  responseTime: { warning: number; error: number; critical: number };
  errorRate: { warning: number; error: number; critical: number };
  connectionPool: { warning: number; error: number; critical: number };
  memoryUsage: { warning: number; error: number; critical: number };
  diskUsage: { warning: number; error: number; critical: number };
  replicationLag: { warning: number; error: number; critical: number };
}

export class DatabaseHealthMonitor {
  private mongoose: typeof mongoose;
  private intervalId?: NodeJS.Timeout;
  private isRunning = false;
  private startTime = Date.now();
  private stats: HealthStats;
  private alerts: HealthAlert[] = [];
  private queryHistory: Array<{ duration: number; timestamp: Date; error?: boolean }> = [];
  private thresholds: HealthThresholds;

  constructor(mongoose: typeof mongoose) {
    this.mongoose = mongoose;
    this.stats = this.initializeStats();
    this.thresholds = {
      responseTime: { warning: 1000, error: 2000, critical: 5000 }, // ms
      errorRate: { warning: 1, error: 5, critical: 10 }, // %
      connectionPool: { warning: 80, error: 90, critical: 95 }, // % usage
      memoryUsage: { warning: 80, error: 90, critical: 95 }, // % usage
      diskUsage: { warning: 80, error: 90, critical: 95 }, // % usage
      replicationLag: { warning: 1000, error: 5000, critical: 10000 }, // ms
    };
  }

  private initializeStats(): HealthStats {
    return {
      uptime: 0,
      totalQueries: 0,
      averageResponseTime: 0,
      errorRate: 0,
      connectionPoolStats: { active: 0, available: 0, created: 0, destroyed: 0 },
      memoryUsage: { resident: 0, virtual: 0 },
      operations: { insert: 0, query: 0, update: 0, delete: 0, getmore: 0, command: 0 },
      connections: { current: 0, available: 0, totalCreated: 0 },
      indexStats: [],
      slowQueries: [],
    };
  }

  start(intervalMs = 30000): void {
    if (this.isRunning) {
      logger.warn('Database health monitor is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();
    
    logger.info('Starting database health monitor', { interval: intervalMs });

    // Setup query monitoring
    this.setupQueryMonitoring();

    // Start periodic health checks
    this.intervalId = setInterval(() => {
      this.collectHealthStats().catch((error) => {
        logger.error('Error collecting health stats:', error);
      });
    }, intervalMs);

    // Initial collection
    this.collectHealthStats().catch((error) => {
      logger.error('Error in initial health stats collection:', error);
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

    logger.info('Stopped database health monitor');
  }

  private setupQueryMonitoring(): void {
    // Monitor query performance using mongoose events
    this.mongoose.connection.on('connected', () => {
      logger.debug('Database health monitor: Connected');
    });

    this.mongoose.connection.on('error', (error) => {
      this.recordQueryResult(0, true);
      logger.error('Database health monitor: Connection error', error);
    });

    this.mongoose.connection.on('disconnected', () => {
      logger.warn('Database health monitor: Disconnected');
    });
  }

  private recordQueryResult(duration: number, isError = false): void {
    this.queryHistory.push({
      duration,
      timestamp: new Date(),
      error: isError,
    });

    // Keep only last 1000 queries
    if (this.queryHistory.length > 1000) {
      this.queryHistory = this.queryHistory.slice(-1000);
    }

    // Update stats
    this.stats.totalQueries++;
    
    if (isError) {
      this.checkThresholds();
    }

    // Log slow queries
    if (duration > 1000 && !isError) {
      this.stats.slowQueries.push({
        ns: 'unknown',
        command: {},
        duration,
        timestamp: new Date(),
      });

      // Keep only last 100 slow queries
      if (this.stats.slowQueries.length > 100) {
        this.stats.slowQueries = this.stats.slowQueries.slice(-100);
      }
    }
  }

  private async collectHealthStats(): Promise<void> {
    try {
      if (this.mongoose.connection.readyState !== 1) {
        logger.warn('Database not connected, skipping health stats collection');
        return;
      }

      // Basic stats
      this.stats.uptime = Date.now() - this.startTime;
      
      // Calculate average response time from recent queries
      const recentQueries = this.queryHistory.filter(q => 
        Date.now() - q.timestamp.getTime() < 300000 // last 5 minutes
      );
      
      if (recentQueries.length > 0) {
        this.stats.averageResponseTime = recentQueries.reduce((sum, q) => sum + q.duration, 0) / recentQueries.length;
        
        const errorQueries = recentQueries.filter(q => q.error);
        this.stats.errorRate = (errorQueries.length / recentQueries.length) * 100;
      }

      // MongoDB server stats
      await this.collectServerStats();

      // Connection pool stats
      this.collectConnectionStats();

      // Index statistics
      await this.collectIndexStats();

      // Check thresholds and generate alerts
      this.checkThresholds();

      logger.debug('Collected database health stats', {
        uptime: this.stats.uptime,
        queries: this.stats.totalQueries,
        avgResponseTime: this.stats.averageResponseTime,
        errorRate: this.stats.errorRate,
      });

    } catch (error) {
      logger.error('Error collecting database health stats:', error);
    }
  }

  private async collectServerStats(): Promise<void> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return;

      // Server status
      const serverStatus = await db.admin().serverStatus();
      
      // Memory usage
      if (serverStatus.mem) {
        this.stats.memoryUsage = {
          resident: serverStatus.mem.resident || 0,
          virtual: serverStatus.mem.virtual || 0,
          mapped: serverStatus.mem.mapped || 0,
        };
      }

      // Operations
      if (serverStatus.opcounters) {
        this.stats.operations = {
          insert: serverStatus.opcounters.insert || 0,
          query: serverStatus.opcounters.query || 0,
          update: serverStatus.opcounters.update || 0,
          delete: serverStatus.opcounters.delete || 0,
          getmore: serverStatus.opcounters.getmore || 0,
          command: serverStatus.opcounters.command || 0,
        };
      }

      // Connections
      if (serverStatus.connections) {
        this.stats.connections = {
          current: serverStatus.connections.current || 0,
          available: serverStatus.connections.available || 0,
          totalCreated: serverStatus.connections.totalCreated || 0,
        };
      }

      // Replication info
      if (serverStatus.repl) {
        this.stats.replication = {
          ismaster: serverStatus.repl.ismaster || false,
          secondary: serverStatus.repl.secondary || false,
          setName: serverStatus.repl.setName,
          setVersion: serverStatus.repl.setVersion,
          hosts: serverStatus.repl.hosts || [],
        };
      }

      // Locking stats
      if (serverStatus.locks) {
        this.stats.locks = {
          timeLockedMicros: {
            r: serverStatus.locks.Global?.timeLockedMicros?.r || 0,
            w: serverStatus.locks.Global?.timeLockedMicros?.w || 0,
          },
          timeAcquiringMicros: {
            r: serverStatus.locks.Global?.timeAcquiringMicros?.r || 0,
            w: serverStatus.locks.Global?.timeAcquiringMicros?.w || 0,
          },
        };
      }

    } catch (error) {
      logger.warn('Could not collect server stats:', error);
    }
  }

  private collectConnectionStats(): void {
    try {
      const connection = this.mongoose.connection;
      
      // Basic connection pool information
      this.stats.connectionPoolStats = {
        active: 1, // Current connection is active
        available: connection.readyState === 1 ? 1 : 0,
        created: 1,
        destroyed: 0,
      };

    } catch (error) {
      logger.warn('Could not collect connection stats:', error);
    }
  }

  private async collectIndexStats(): Promise<void> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) return;

      const collections = await db.listCollections().toArray();
      const indexStats: typeof this.stats.indexStats = [];

      for (const collection of collections) {
        try {
          const coll = db.collection(collection.name);
          const indexes = await coll.listIndexes().toArray();

          for (const index of indexes) {
            indexStats.push({
              collection: collection.name,
              index: index.name,
              usage: {
                ops: 0, // Would need to get from $indexStats aggregation
                since: new Date(),
              },
            });
          }
        } catch (error) {
          logger.debug(`Could not collect index stats for ${collection.name}:`, error);
        }
      }

      this.stats.indexStats = indexStats;

    } catch (error) {
      logger.warn('Could not collect index stats:', error);
    }
  }

  private checkThresholds(): void {
    const now = new Date();

    // Check response time
    if (this.stats.averageResponseTime > this.thresholds.responseTime.critical) {
      this.addAlert('critical', 'Average response time is critically high', 'responseTime', this.stats.averageResponseTime, this.thresholds.responseTime.critical);
    } else if (this.stats.averageResponseTime > this.thresholds.responseTime.error) {
      this.addAlert('error', 'Average response time is high', 'responseTime', this.stats.averageResponseTime, this.thresholds.responseTime.error);
    } else if (this.stats.averageResponseTime > this.thresholds.responseTime.warning) {
      this.addAlert('warning', 'Average response time is elevated', 'responseTime', this.stats.averageResponseTime, this.thresholds.responseTime.warning);
    }

    // Check error rate
    if (this.stats.errorRate > this.thresholds.errorRate.critical) {
      this.addAlert('critical', 'Error rate is critically high', 'errorRate', this.stats.errorRate, this.thresholds.errorRate.critical);
    } else if (this.stats.errorRate > this.thresholds.errorRate.error) {
      this.addAlert('error', 'Error rate is high', 'errorRate', this.stats.errorRate, this.thresholds.errorRate.error);
    } else if (this.stats.errorRate > this.thresholds.errorRate.warning) {
      this.addAlert('warning', 'Error rate is elevated', 'errorRate', this.stats.errorRate, this.thresholds.errorRate.warning);
    }

    // Check connection pool usage
    const poolUsage = (this.stats.connectionPoolStats.active / (this.stats.connectionPoolStats.active + this.stats.connectionPoolStats.available)) * 100;
    if (poolUsage > this.thresholds.connectionPool.critical) {
      this.addAlert('critical', 'Connection pool usage is critically high', 'connectionPool', poolUsage, this.thresholds.connectionPool.critical);
    } else if (poolUsage > this.thresholds.connectionPool.error) {
      this.addAlert('error', 'Connection pool usage is high', 'connectionPool', poolUsage, this.thresholds.connectionPool.error);
    } else if (poolUsage > this.thresholds.connectionPool.warning) {
      this.addAlert('warning', 'Connection pool usage is elevated', 'connectionPool', poolUsage, this.thresholds.connectionPool.warning);
    }

    // Clean up old alerts (older than 1 hour)
    this.alerts = this.alerts.filter(alert => 
      now.getTime() - alert.timestamp.getTime() < 3600000
    );
  }

  private addAlert(type: HealthAlert['type'], message: string, metric: string, value: number, threshold: number): void {
    // Don't add duplicate alerts for the same metric within 5 minutes
    const recentAlert = this.alerts.find(alert => 
      alert.metric === metric && 
      alert.type === type &&
      Date.now() - alert.timestamp.getTime() < 300000 &&
      !alert.resolved
    );

    if (recentAlert) {
      return;
    }

    const alert: HealthAlert = {
      type,
      message,
      metric,
      value,
      threshold,
      timestamp: new Date(),
    };

    this.alerts.push(alert);
    
    logger[type === 'warning' ? 'warn' : 'error'](`Database health alert: ${message}`, {
      metric,
      value,
      threshold,
    });

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  getHealthStats(): HealthStats {
    return { ...this.stats };
  }

  getAlerts(type?: HealthAlert['type']): HealthAlert[] {
    return type 
      ? this.alerts.filter(alert => alert.type === type && !alert.resolved)
      : this.alerts.filter(alert => !alert.resolved);
  }

  getAllAlerts(): HealthAlert[] {
    return [...this.alerts];
  }

  resolveAlert(alertId: number): boolean {
    const alert = this.alerts[alertId];
    if (alert) {
      alert.resolved = new Date();
      return true;
    }
    return false;
  }

  getHealthScore(): number {
    const weights = {
      responseTime: 0.3,
      errorRate: 0.3,
      connectionPool: 0.2,
      memoryUsage: 0.2,
    };

    let score = 100;

    // Response time score
    if (this.stats.averageResponseTime > this.thresholds.responseTime.critical) {
      score -= weights.responseTime * 50;
    } else if (this.stats.averageResponseTime > this.thresholds.responseTime.error) {
      score -= weights.responseTime * 30;
    } else if (this.stats.averageResponseTime > this.thresholds.responseTime.warning) {
      score -= weights.responseTime * 10;
    }

    // Error rate score
    if (this.stats.errorRate > this.thresholds.errorRate.critical) {
      score -= weights.errorRate * 50;
    } else if (this.stats.errorRate > this.thresholds.errorRate.error) {
      score -= weights.errorRate * 30;
    } else if (this.stats.errorRate > this.thresholds.errorRate.warning) {
      score -= weights.errorRate * 10;
    }

    // Connection pool score
    const poolUsage = (this.stats.connectionPoolStats.active / (this.stats.connectionPoolStats.active + this.stats.connectionPoolStats.available)) * 100;
    if (poolUsage > this.thresholds.connectionPool.critical) {
      score -= weights.connectionPool * 50;
    } else if (poolUsage > this.thresholds.connectionPool.error) {
      score -= weights.connectionPool * 30;
    } else if (poolUsage > this.thresholds.connectionPool.warning) {
      score -= weights.connectionPool * 10;
    }

    return Math.max(0, Math.round(score));
  }

  isHealthy(): boolean {
    return this.getHealthScore() >= 80 && this.getAlerts('critical').length === 0;
  }

  getStatus(): 'healthy' | 'warning' | 'error' | 'critical' {
    const criticalAlerts = this.getAlerts('critical');
    const errorAlerts = this.getAlerts('error');
    const warningAlerts = this.getAlerts('warning');

    if (criticalAlerts.length > 0) return 'critical';
    if (errorAlerts.length > 0) return 'error';
    if (warningAlerts.length > 0) return 'warning';
    return 'healthy';
  }

  // Method to manually trigger a health check
  async triggerHealthCheck(): Promise<void> {
    await this.collectHealthStats();
  }

  // Export health data for monitoring dashboards
  exportHealthData() {
    return {
      stats: this.getHealthStats(),
      alerts: this.getAllAlerts(),
      score: this.getHealthScore(),
      status: this.getStatus(),
      isHealthy: this.isHealthy(),
      timestamp: new Date().toISOString(),
    };
  }
}