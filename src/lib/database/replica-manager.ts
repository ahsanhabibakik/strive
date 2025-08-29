/**
 * Database Replica Manager
 * Provides read/write replica support and intelligent connection load balancing
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';

export interface ReplicaConfig {
  host: string;
  port: number;
  priority: number; // Higher = preferred
  maxConnections: number;
  weight: number; // Load balancing weight
  readonly?: boolean; // Force read-only for this replica
}

export interface ReplicaSetConfig {
  name: string;
  primary: ReplicaConfig;
  secondaries: ReplicaConfig[];
  arbiter?: ReplicaConfig;
  readPreference: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest';
  readConcern: 'local' | 'available' | 'majority' | 'linearizable' | 'snapshot';
  writeConcern: {
    w: number | 'majority';
    j: boolean;
    wtimeout: number;
  };
  loadBalancing: {
    strategy: 'round_robin' | 'weighted' | 'least_connections' | 'response_time';
    healthCheckInterval: number;
    failoverTimeout: number;
  };
}

export interface ConnectionStats {
  host: string;
  port: number;
  isConnected: boolean;
  isPrimary: boolean;
  isSecondary: boolean;
  activeConnections: number;
  totalConnections: number;
  averageResponseTime: number;
  lastHealthCheck: Date;
  errorCount: number;
  uptime: number;
}

export interface LoadBalancerStats {
  totalRequests: number;
  readRequests: number;
  writeRequests: number;
  failovers: number;
  averageResponseTime: number;
  replicaStats: ConnectionStats[];
  currentPrimary?: string;
  availableSecondaries: string[];
}

export class ReplicaManager {
  private config: ReplicaSetConfig;
  private connections: Map<string, mongoose.Connection> = new Map();
  private connectionStats: Map<string, ConnectionStats> = new Map();
  private loadBalancerStats: LoadBalancerStats;
  private healthCheckInterval?: NodeJS.Timeout;
  private roundRobinIndex = 0;
  private isShuttingDown = false;

  constructor(config: ReplicaSetConfig) {
    this.config = config;
    this.loadBalancerStats = {
      totalRequests: 0,
      readRequests: 0,
      writeRequests: 0,
      failovers: 0,
      averageResponseTime: 0,
      replicaStats: [],
      availableSecondaries: [],
    };

    this.initializeConnections();
    this.startHealthChecking();
  }

  private async initializeConnections(): Promise<void> {
    try {
      // Initialize primary connection
      await this.createConnection(this.config.primary, true);

      // Initialize secondary connections
      for (const secondary of this.config.secondaries) {
        await this.createConnection(secondary, false);
      }

      // Initialize arbiter connection if configured
      if (this.config.arbiter) {
        await this.createConnection(this.config.arbiter, false, true);
      }

      logger.info(`Initialized replica set: ${this.config.name}`);
    } catch (error) {
      logger.error('Failed to initialize replica connections:', error);
      throw error;
    }
  }

  private async createConnection(
    replicaConfig: ReplicaConfig, 
    isPrimary: boolean = false, 
    isArbiter: boolean = false
  ): Promise<void> {
    const connectionId = `${replicaConfig.host}:${replicaConfig.port}`;
    
    try {
      const connectionString = `mongodb://${replicaConfig.host}:${replicaConfig.port}`;
      
      const options: mongoose.ConnectOptions = {
        maxPoolSize: replicaConfig.maxConnections,
        readPreference: isPrimary ? 'primary' : this.config.readPreference,
        readConcern: { level: this.config.readConcern },
        writeConcern: this.config.writeConcern,
        retryWrites: true,
        retryReads: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
      };

      const connection = mongoose.createConnection(connectionString, options);
      
      // Setup connection event handlers
      this.setupConnectionEvents(connection, connectionId, isPrimary, isArbiter);
      
      this.connections.set(connectionId, connection);
      
      // Initialize connection stats
      const stats: ConnectionStats = {
        host: replicaConfig.host,
        port: replicaConfig.port,
        isConnected: false,
        isPrimary,
        isSecondary: !isPrimary && !isArbiter,
        activeConnections: 0,
        totalConnections: 0,
        averageResponseTime: 0,
        lastHealthCheck: new Date(),
        errorCount: 0,
        uptime: 0,
      };
      
      this.connectionStats.set(connectionId, stats);

      logger.info(`Created connection to ${connectionId} (${isPrimary ? 'primary' : isArbiter ? 'arbiter' : 'secondary'})`);
    } catch (error) {
      logger.error(`Failed to create connection to ${connectionId}:`, error);
      throw error;
    }
  }

  private setupConnectionEvents(
    connection: mongoose.Connection, 
    connectionId: string, 
    isPrimary: boolean, 
    isArbiter: boolean
  ): void {
    connection.on('connected', () => {
      const stats = this.connectionStats.get(connectionId);
      if (stats) {
        stats.isConnected = true;
        stats.lastHealthCheck = new Date();
      }
      logger.info(`Connected to ${connectionId}`);
    });

    connection.on('error', (error) => {
      const stats = this.connectionStats.get(connectionId);
      if (stats) {
        stats.errorCount++;
      }
      logger.error(`Connection error for ${connectionId}:`, error);
    });

    connection.on('disconnected', () => {
      const stats = this.connectionStats.get(connectionId);
      if (stats) {
        stats.isConnected = false;
      }
      logger.warn(`Disconnected from ${connectionId}`);

      // Trigger failover if this was the primary
      if (isPrimary && !this.isShuttingDown) {
        this.handlePrimaryFailover().catch(error => {
          logger.error('Primary failover failed:', error);
        });
      }
    });

    connection.on('reconnected', () => {
      const stats = this.connectionStats.get(connectionId);
      if (stats) {
        stats.isConnected = true;
        stats.lastHealthCheck = new Date();
      }
      logger.info(`Reconnected to ${connectionId}`);
    });
  }

  /**
   * Get the appropriate connection for a read operation
   */
  async getReadConnection(): Promise<mongoose.Connection> {
    this.loadBalancerStats.readRequests++;
    this.loadBalancerStats.totalRequests++;

    const startTime = Date.now();
    
    try {
      let connection: mongoose.Connection | null = null;

      switch (this.config.readPreference) {
        case 'primary':
          connection = await this.getPrimaryConnection();
          break;
        
        case 'secondary':
          connection = await this.getSecondaryConnection();
          if (!connection) {
            throw new Error('No secondary connections available');
          }
          break;
        
        case 'primaryPreferred':
          connection = await this.getPrimaryConnection();
          if (!connection) {
            connection = await this.getSecondaryConnection();
          }
          break;
        
        case 'secondaryPreferred':
          connection = await this.getSecondaryConnection();
          if (!connection) {
            connection = await this.getPrimaryConnection();
          }
          break;
        
        case 'nearest':
          connection = await this.getNearestConnection();
          break;
      }

      if (!connection) {
        throw new Error('No available connections for read operation');
      }

      this.updateResponseTime(Date.now() - startTime);
      return connection;
    } catch (error) {
      logger.error('Failed to get read connection:', error);
      throw error;
    }
  }

  /**
   * Get the primary connection for write operations
   */
  async getWriteConnection(): Promise<mongoose.Connection> {
    this.loadBalancerStats.writeRequests++;
    this.loadBalancerStats.totalRequests++;

    const startTime = Date.now();
    
    try {
      const connection = await this.getPrimaryConnection();
      if (!connection) {
        throw new Error('Primary connection not available for write operation');
      }

      this.updateResponseTime(Date.now() - startTime);
      return connection;
    } catch (error) {
      logger.error('Failed to get write connection:', error);
      throw error;
    }
  }

  private async getPrimaryConnection(): Promise<mongoose.Connection | null> {
    const primaryId = `${this.config.primary.host}:${this.config.primary.port}`;
    const connection = this.connections.get(primaryId);
    const stats = this.connectionStats.get(primaryId);

    if (connection && stats?.isConnected) {
      this.loadBalancerStats.currentPrimary = primaryId;
      return connection;
    }

    return null;
  }

  private async getSecondaryConnection(): Promise<mongoose.Connection | null> {
    const availableSecondaries = this.getAvailableSecondaries();
    
    if (availableSecondaries.length === 0) {
      return null;
    }

    let selectedConnection: mongoose.Connection | null = null;

    switch (this.config.loadBalancing.strategy) {
      case 'round_robin':
        selectedConnection = this.selectRoundRobin(availableSecondaries);
        break;
      
      case 'weighted':
        selectedConnection = this.selectWeighted(availableSecondaries);
        break;
      
      case 'least_connections':
        selectedConnection = this.selectLeastConnections(availableSecondaries);
        break;
      
      case 'response_time':
        selectedConnection = this.selectByResponseTime(availableSecondaries);
        break;
    }

    return selectedConnection;
  }

  private async getNearestConnection(): Promise<mongoose.Connection | null> {
    // Get all available connections and select the one with best response time
    const allConnections = this.getAllAvailableConnections();
    return this.selectByResponseTime(allConnections);
  }

  private getAvailableSecondaries(): Array<{ connectionId: string; connection: mongoose.Connection }> {
    const available: Array<{ connectionId: string; connection: mongoose.Connection }> = [];

    for (const secondary of this.config.secondaries) {
      const connectionId = `${secondary.host}:${secondary.port}`;
      const connection = this.connections.get(connectionId);
      const stats = this.connectionStats.get(connectionId);

      if (connection && stats?.isConnected && stats?.isSecondary) {
        available.push({ connectionId, connection });
      }
    }

    this.loadBalancerStats.availableSecondaries = available.map(a => a.connectionId);
    return available;
  }

  private getAllAvailableConnections(): Array<{ connectionId: string; connection: mongoose.Connection }> {
    const available: Array<{ connectionId: string; connection: mongoose.Connection }> = [];

    for (const [connectionId, connection] of this.connections.entries()) {
      const stats = this.connectionStats.get(connectionId);
      if (connection && stats?.isConnected) {
        available.push({ connectionId, connection });
      }
    }

    return available;
  }

  private selectRoundRobin(connections: Array<{ connectionId: string; connection: mongoose.Connection }>): mongoose.Connection {
    const connection = connections[this.roundRobinIndex % connections.length];
    this.roundRobinIndex++;
    return connection.connection;
  }

  private selectWeighted(connections: Array<{ connectionId: string; connection: mongoose.Connection }>): mongoose.Connection {
    // Select based on replica weights
    const weights = connections.map(conn => {
      const replica = this.config.secondaries.find(s => 
        `${s.host}:${s.port}` === conn.connectionId
      );
      return replica?.weight || 1;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (let i = 0; i < connections.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        return connections[i].connection;
      }
    }

    // Fallback to first connection
    return connections[0].connection;
  }

  private selectLeastConnections(connections: Array<{ connectionId: string; connection: mongoose.Connection }>): mongoose.Connection {
    let minConnections = Infinity;
    let selectedConnection = connections[0].connection;

    for (const conn of connections) {
      const stats = this.connectionStats.get(conn.connectionId);
      if (stats && stats.activeConnections < minConnections) {
        minConnections = stats.activeConnections;
        selectedConnection = conn.connection;
      }
    }

    return selectedConnection;
  }

  private selectByResponseTime(connections: Array<{ connectionId: string; connection: mongoose.Connection }>): mongoose.Connection {
    let bestResponseTime = Infinity;
    let selectedConnection = connections[0].connection;

    for (const conn of connections) {
      const stats = this.connectionStats.get(conn.connectionId);
      if (stats && stats.averageResponseTime < bestResponseTime) {
        bestResponseTime = stats.averageResponseTime;
        selectedConnection = conn.connection;
      }
    }

    return selectedConnection;
  }

  private async handlePrimaryFailover(): Promise<void> {
    logger.warn('Primary connection failed, attempting failover...');
    this.loadBalancerStats.failovers++;

    try {
      // Wait for failover timeout
      await new Promise(resolve => setTimeout(resolve, this.config.loadBalancing.failoverTimeout));

      // Try to reconnect to primary
      await this.reconnectPrimary();

      logger.info('Primary failover completed successfully');
    } catch (error) {
      logger.error('Primary failover failed:', error);
      
      // Could implement promotion of secondary to primary here
      // For now, we'll just log the error
    }
  }

  private async reconnectPrimary(): Promise<void> {
    const primaryId = `${this.config.primary.host}:${this.config.primary.port}`;
    const connection = this.connections.get(primaryId);
    
    if (connection) {
      try {
        // Force reconnection
        await connection.close();
        this.connections.delete(primaryId);
        this.connectionStats.delete(primaryId);
        
        // Recreate connection
        await this.createConnection(this.config.primary, true);
        
        logger.info('Primary reconnection successful');
      } catch (error) {
        logger.error('Primary reconnection failed:', error);
        throw error;
      }
    }
  }

  private startHealthChecking(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck().catch(error => {
        logger.error('Health check failed:', error);
      });
    }, this.config.loadBalancing.healthCheckInterval);
  }

  private async performHealthCheck(): Promise<void> {
    const promises = Array.from(this.connections.entries()).map(async ([connectionId, connection]) => {
      const stats = this.connectionStats.get(connectionId);
      if (!stats) return;

      const startTime = Date.now();
      
      try {
        // Perform a simple ping operation
        await connection.db.admin().ping();
        
        const responseTime = Date.now() - startTime;
        stats.averageResponseTime = (stats.averageResponseTime + responseTime) / 2;
        stats.lastHealthCheck = new Date();
        stats.isConnected = connection.readyState === 1;
        
      } catch (error) {
        stats.errorCount++;
        stats.isConnected = false;
        logger.debug(`Health check failed for ${connectionId}:`, error);
      }
    });

    await Promise.all(promises);
    this.updateLoadBalancerStats();
  }

  private updateResponseTime(responseTime: number): void {
    const currentAvg = this.loadBalancerStats.averageResponseTime;
    const totalRequests = this.loadBalancerStats.totalRequests;
    
    this.loadBalancerStats.averageResponseTime = 
      (currentAvg * (totalRequests - 1) + responseTime) / totalRequests;
  }

  private updateLoadBalancerStats(): void {
    this.loadBalancerStats.replicaStats = Array.from(this.connectionStats.values());
  }

  /**
   * Get load balancer statistics
   */
  getLoadBalancerStats(): LoadBalancerStats {
    this.updateLoadBalancerStats();
    return { ...this.loadBalancerStats };
  }

  /**
   * Get connection statistics for a specific replica
   */
  getConnectionStats(host: string, port: number): ConnectionStats | null {
    const connectionId = `${host}:${port}`;
    return this.connectionStats.get(connectionId) || null;
  }

  /**
   * Get all connection statistics
   */
  getAllConnectionStats(): ConnectionStats[] {
    return Array.from(this.connectionStats.values());
  }

  /**
   * Check if the replica set is healthy
   */
  isHealthy(): boolean {
    const primaryStats = this.connectionStats.get(`${this.config.primary.host}:${this.config.primary.port}`);
    const availableSecondaries = this.getAvailableSecondaries();
    
    return Boolean(
      primaryStats?.isConnected && 
      availableSecondaries.length > 0
    );
  }

  /**
   * Get replica set status
   */
  getStatus(): {
    status: 'healthy' | 'degraded' | 'failed';
    primaryConnected: boolean;
    secondariesAvailable: number;
    totalConnections: number;
    issues: string[];
  } {
    const primaryStats = this.connectionStats.get(`${this.config.primary.host}:${this.config.primary.port}`);
    const availableSecondaries = this.getAvailableSecondaries();
    const allStats = this.getAllConnectionStats();
    const issues: string[] = [];

    const primaryConnected = Boolean(primaryStats?.isConnected);
    
    if (!primaryConnected) {
      issues.push('Primary connection is down');
    }

    if (availableSecondaries.length === 0) {
      issues.push('No secondary connections available');
    }

    const failedConnections = allStats.filter(stats => !stats.isConnected);
    if (failedConnections.length > 0) {
      issues.push(`${failedConnections.length} connection(s) failed`);
    }

    let status: 'healthy' | 'degraded' | 'failed' = 'healthy';
    
    if (!primaryConnected) {
      status = 'failed';
    } else if (availableSecondaries.length < this.config.secondaries.length) {
      status = 'degraded';
    }

    return {
      status,
      primaryConnected,
      secondariesAvailable: availableSecondaries.length,
      totalConnections: allStats.filter(s => s.isConnected).length,
      issues,
    };
  }

  /**
   * Force a manual failover (for testing or maintenance)
   */
  async forceFailover(): Promise<void> {
    logger.info('Manual failover initiated');
    await this.handlePrimaryFailover();
  }

  /**
   * Shutdown all connections
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }

    const shutdownPromises = Array.from(this.connections.values()).map(connection => 
      connection.close().catch(error => {
        logger.error('Error closing connection during shutdown:', error);
      })
    );

    await Promise.all(shutdownPromises);
    
    this.connections.clear();
    this.connectionStats.clear();
    
    logger.info(`Replica manager for ${this.config.name} shut down successfully`);
  }
}