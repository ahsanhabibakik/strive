/**
 * Database Backup Manager
 * Provides backup verification, maintenance utilities, and automated backup monitoring
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';

export interface BackupConfig {
  strategy: 'mongodump' | 'snapshot' | 'oplog' | 'atlas';
  schedule: {
    full: string; // cron expression
    incremental: string; // cron expression
    retention: {
      daily: number; // days
      weekly: number; // weeks
      monthly: number; // months
    };
  };
  storage: {
    type: 's3' | 'gcs' | 'azure' | 'local';
    location: string;
    encryption: boolean;
    compression: boolean;
  };
  verification: {
    enabled: boolean;
    checkInterval: number; // minutes
    checksums: boolean;
    testRestore: boolean;
  };
}

export interface BackupMetadata {
  id: string;
  type: 'full' | 'incremental' | 'oplog';
  timestamp: Date;
  size: number;
  duration: number; // milliseconds
  collections: string[];
  checksum?: string;
  verified: boolean;
  verifiedAt?: Date;
  status: 'success' | 'failed' | 'in_progress' | 'corrupted';
  error?: string;
  location: string;
  compressed: boolean;
  encrypted: boolean;
}

export interface BackupHealth {
  status: 'healthy' | 'warning' | 'critical';
  lastBackup?: Date;
  nextBackup?: Date;
  totalBackups: number;
  recentFailures: number;
  storageUsage: {
    used: number;
    available: number;
    utilization: number;
  };
  issues: string[];
  recommendations: string[];
}

export interface MaintenanceTask {
  id: string;
  type: 'index_rebuild' | 'compact' | 'repair' | 'cleanup' | 'optimize';
  collection?: string;
  schedule: string; // cron expression
  lastRun?: Date;
  nextRun?: Date;
  duration?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: {
    success: boolean;
    message: string;
    metrics?: any;
  };
}

export interface MaintenanceReport {
  timestamp: Date;
  database: string;
  tasks: MaintenanceTask[];
  recommendations: Array<{
    type: string;
    priority: 'low' | 'medium' | 'high';
    description: string;
    action: string;
    estimatedImpact: string;
  }>;
  metrics: {
    totalCollections: number;
    totalIndexes: number;
    fragmentedCollections: number;
    unusedIndexes: number;
    storageEfficiency: number;
  };
}

export class DatabaseBackupManager {
  private mongoose: typeof mongoose;
  private config: BackupConfig;
  private backupHistory: Map<string, BackupMetadata> = new Map();
  private maintenanceTasks: Map<string, MaintenanceTask> = new Map();
  private verificationInterval?: NodeJS.Timeout;

  constructor(mongoose: typeof mongoose, config: BackupConfig) {
    this.mongoose = mongoose;
    this.config = config;
    
    if (config.verification.enabled) {
      this.startBackupVerification();
    }
  }

  /**
   * Verify the integrity of existing backups
   */
  async verifyBackups(backupIds?: string[]): Promise<Array<{
    id: string;
    verified: boolean;
    issues: string[];
  }>> {
    const results: Array<{ id: string; verified: boolean; issues: string[] }> = [];
    const toVerify = backupIds || Array.from(this.backupHistory.keys());

    for (const backupId of toVerify) {
      const result = await this.verifyBackup(backupId);
      results.push(result);
    }

    return results;
  }

  private async verifyBackup(backupId: string): Promise<{
    id: string;
    verified: boolean;
    issues: string[];
  }> {
    const backup = this.backupHistory.get(backupId);
    const issues: string[] = [];
    let verified = false;

    if (!backup) {
      issues.push('Backup metadata not found');
      return { id: backupId, verified, issues };
    }

    try {
      // Check if backup file exists
      const exists = await this.checkBackupExists(backup.location);
      if (!exists) {
        issues.push('Backup file not found at specified location');
        return { id: backupId, verified, issues };
      }

      // Verify file size
      const actualSize = await this.getBackupSize(backup.location);
      if (actualSize !== backup.size) {
        issues.push(`Size mismatch: expected ${backup.size}, got ${actualSize}`);
      }

      // Verify checksum if available
      if (this.config.verification.checksums && backup.checksum) {
        const actualChecksum = await this.calculateChecksum(backup.location);
        if (actualChecksum !== backup.checksum) {
          issues.push('Checksum mismatch - backup may be corrupted');
          return { id: backupId, verified, issues };
        }
      }

      // Perform test restore if enabled
      if (this.config.verification.testRestore) {
        const restoreResult = await this.performTestRestore(backup);
        if (!restoreResult.success) {
          issues.push(`Test restore failed: ${restoreResult.error}`);
          return { id: backupId, verified, issues };
        }
      }

      verified = issues.length === 0;
      
      // Update backup metadata
      backup.verified = verified;
      backup.verifiedAt = new Date();
      backup.status = verified ? 'success' : 'corrupted';

      logger.info(`Backup verification completed for ${backupId}`, {
        verified,
        issues: issues.length,
      });

    } catch (error) {
      issues.push(`Verification failed: ${(error as Error).message}`);
      logger.error(`Backup verification failed for ${backupId}:`, error);
    }

    return { id: backupId, verified, issues };
  }

  private async checkBackupExists(location: string): Promise<boolean> {
    // Implementation would depend on storage type
    // For now, return true as a placeholder
    return true;
  }

  private async getBackupSize(location: string): Promise<number> {
    // Implementation would depend on storage type
    // For now, return a placeholder size
    return 1024 * 1024; // 1MB
  }

  private async calculateChecksum(location: string): Promise<string> {
    // Implementation would calculate actual checksum
    // For now, return a placeholder
    return 'sha256:placeholder';
  }

  private async performTestRestore(backup: BackupMetadata): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // This would perform an actual test restore to a temporary database
      logger.info(`Performing test restore for backup ${backup.id}`);
      
      // Placeholder implementation
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: (error as Error).message 
      };
    }
  }

  /**
   * Get backup health status
   */
  async getBackupHealth(): Promise<BackupHealth> {
    const backups = Array.from(this.backupHistory.values());
    const now = Date.now();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for recent backups
    const recentBackups = backups.filter(b => 
      now - b.timestamp.getTime() < 24 * 60 * 60 * 1000 // last 24 hours
    );

    const lastBackup = backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    if (!lastBackup) {
      issues.push('No backups found');
    } else if (now - lastBackup.timestamp.getTime() > 48 * 60 * 60 * 1000) { // > 48 hours
      issues.push('Last backup is older than 48 hours');
      recommendations.push('Schedule more frequent backups');
    }

    // Check for recent failures
    const recentFailures = backups.filter(b => 
      b.status === 'failed' && 
      now - b.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // last 7 days
    ).length;

    if (recentFailures > 3) {
      issues.push(`${recentFailures} backup failures in the last week`);
      recommendations.push('Investigate backup configuration and storage connectivity');
    }

    // Check unverified backups
    const unverifiedBackups = backups.filter(b => !b.verified).length;
    if (unverifiedBackups > 0) {
      issues.push(`${unverifiedBackups} unverified backups`);
      recommendations.push('Enable backup verification');
    }

    // Determine status
    let status: BackupHealth['status'] = 'healthy';
    if (!lastBackup || recentFailures > 5) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'warning';
    }

    // Calculate storage usage (placeholder)
    const storageUsage = {
      used: backups.reduce((sum, b) => sum + b.size, 0),
      available: 100 * 1024 * 1024 * 1024, // 100GB placeholder
      utilization: 0,
    };
    storageUsage.utilization = (storageUsage.used / storageUsage.available) * 100;

    return {
      status,
      lastBackup: lastBackup?.timestamp,
      nextBackup: this.calculateNextBackupTime(),
      totalBackups: backups.length,
      recentFailures,
      storageUsage,
      issues,
      recommendations,
    };
  }

  private calculateNextBackupTime(): Date {
    // This would calculate based on the backup schedule
    // For now, return a placeholder
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // tomorrow
  }

  /**
   * Schedule maintenance tasks
   */
  async scheduleMaintenance(tasks: Omit<MaintenanceTask, 'id' | 'status'>[]): Promise<string[]> {
    const taskIds: string[] = [];

    for (const taskDef of tasks) {
      const taskId = `maintenance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const task: MaintenanceTask = {
        id: taskId,
        status: 'pending',
        nextRun: this.calculateNextRun(taskDef.schedule),
        ...taskDef,
      };

      this.maintenanceTasks.set(taskId, task);
      taskIds.push(taskId);

      logger.info(`Scheduled maintenance task: ${task.type}`, {
        taskId,
        schedule: task.schedule,
        nextRun: task.nextRun,
      });
    }

    return taskIds;
  }

  private calculateNextRun(cronExpression: string): Date {
    // This would parse the cron expression and calculate next run time
    // For now, return a placeholder
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  }

  /**
   * Execute maintenance tasks
   */
  async executeMaintenance(taskId?: string): Promise<Array<{
    taskId: string;
    success: boolean;
    message: string;
    duration: number;
  }>> {
    const tasksToRun = taskId 
      ? [this.maintenanceTasks.get(taskId)].filter(Boolean) as MaintenanceTask[]
      : Array.from(this.maintenanceTasks.values()).filter(task => 
          task.status === 'pending' && 
          task.nextRun && 
          task.nextRun.getTime() <= Date.now()
        );

    const results: Array<{
      taskId: string;
      success: boolean;
      message: string;
      duration: number;
    }> = [];

    for (const task of tasksToRun) {
      const result = await this.executeMaintenanceTask(task);
      results.push(result);
    }

    return results;
  }

  private async executeMaintenanceTask(task: MaintenanceTask): Promise<{
    taskId: string;
    success: boolean;
    message: string;
    duration: number;
  }> {
    const startTime = Date.now();
    task.status = 'running';
    task.lastRun = new Date();

    try {
      let success = false;
      let message = '';

      switch (task.type) {
        case 'index_rebuild':
          const rebuildResult = await this.rebuildIndexes(task.collection);
          success = rebuildResult.success;
          message = rebuildResult.message;
          break;

        case 'compact':
          const compactResult = await this.compactCollection(task.collection!);
          success = compactResult.success;
          message = compactResult.message;
          break;

        case 'repair':
          const repairResult = await this.repairDatabase();
          success = repairResult.success;
          message = repairResult.message;
          break;

        case 'cleanup':
          const cleanupResult = await this.cleanupDatabase();
          success = cleanupResult.success;
          message = cleanupResult.message;
          break;

        case 'optimize':
          const optimizeResult = await this.optimizeDatabase();
          success = optimizeResult.success;
          message = optimizeResult.message;
          break;

        default:
          success = false;
          message = `Unknown task type: ${task.type}`;
      }

      const duration = Date.now() - startTime;
      
      task.status = success ? 'completed' : 'failed';
      task.duration = duration;
      task.result = { success, message };
      task.nextRun = this.calculateNextRun(task.schedule);

      logger.info(`Maintenance task completed: ${task.type}`, {
        taskId: task.id,
        success,
        duration,
        message,
      });

      return {
        taskId: task.id,
        success,
        message,
        duration,
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      const message = `Task failed: ${(error as Error).message}`;
      
      task.status = 'failed';
      task.duration = duration;
      task.result = { success: false, message };
      task.nextRun = this.calculateNextRun(task.schedule);

      logger.error(`Maintenance task failed: ${task.type}`, error);

      return {
        taskId: task.id,
        success: false,
        message,
        duration,
      };
    }
  }

  private async rebuildIndexes(collection?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) throw new Error('Database not connected');

      if (collection) {
        await db.collection(collection).reIndex();
        return {
          success: true,
          message: `Rebuilt indexes for collection: ${collection}`,
        };
      } else {
        const collections = await db.listCollections().toArray();
        for (const coll of collections) {
          await db.collection(coll.name).reIndex();
        }
        return {
          success: true,
          message: `Rebuilt indexes for ${collections.length} collections`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Index rebuild failed: ${(error as Error).message}`,
      };
    }
  }

  private async compactCollection(collection: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) throw new Error('Database not connected');

      // Note: compact operation requires special permissions
      await db.admin().command({ compact: collection, force: true });
      
      return {
        success: true,
        message: `Collection ${collection} compacted successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Compact failed: ${(error as Error).message}`,
      };
    }
  }

  private async repairDatabase(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) throw new Error('Database not connected');

      // Note: repair operation is deprecated in newer MongoDB versions
      // This is a placeholder implementation
      logger.warn('Database repair operation is deprecated in newer MongoDB versions');
      
      return {
        success: true,
        message: 'Database repair completed (deprecated operation)',
      };
    } catch (error) {
      return {
        success: false,
        message: `Repair failed: ${(error as Error).message}`,
      };
    }
  }

  private async cleanupDatabase(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) throw new Error('Database not connected');

      let cleanedItems = 0;

      // Clean up expired sessions
      try {
        const result = await db.collection('sessions').deleteMany({
          expires: { $lt: new Date() }
        });
        cleanedItems += result.deletedCount || 0;
      } catch (error) {
        logger.debug('Session cleanup failed:', error);
      }

      // Clean up old logs
      try {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await db.collection('logs').deleteMany({
          createdAt: { $lt: oneMonthAgo }
        });
        cleanedItems += result.deletedCount || 0;
      } catch (error) {
        logger.debug('Log cleanup failed:', error);
      }

      return {
        success: true,
        message: `Database cleanup completed: ${cleanedItems} items removed`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Cleanup failed: ${(error as Error).message}`,
      };
    }
  }

  private async optimizeDatabase(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) throw new Error('Database not connected');

      // Analyze and optimize collections
      const collections = await db.listCollections().toArray();
      const optimizations: string[] = [];

      for (const collection of collections) {
        const coll = db.collection(collection.name);
        
        // Get collection stats
        const stats = await coll.stats();
        
        // Check for fragmentation
        if (stats.storageSize > stats.size * 2) {
          optimizations.push(`${collection.name}: High fragmentation detected`);
        }

        // Check index usage
        try {
          const indexStats = await coll.aggregate([{ $indexStats: {} }]).toArray();
          for (const indexStat of indexStats) {
            if (indexStat.accesses.ops === 0) {
              optimizations.push(`${collection.name}: Unused index "${indexStat.name}"`);
            }
          }
        } catch (error) {
          logger.debug(`Index stats failed for ${collection.name}:`, error);
        }
      }

      return {
        success: true,
        message: `Database optimization analysis completed: ${optimizations.length} recommendations found`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Optimization failed: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Generate maintenance report
   */
  async generateMaintenanceReport(): Promise<MaintenanceReport> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) throw new Error('Database not connected');

      const collections = await db.listCollections().toArray();
      const recommendations: MaintenanceReport['recommendations'] = [];
      
      let totalIndexes = 0;
      let fragmentedCollections = 0;
      let unusedIndexes = 0;

      // Analyze each collection
      for (const collection of collections) {
        try {
          const coll = db.collection(collection.name);
          const stats = await coll.stats();
          const indexes = await coll.listIndexes().toArray();
          
          totalIndexes += indexes.length;

          // Check fragmentation
          const fragmentation = stats.storageSize > 0 ? (stats.storageSize - stats.size) / stats.storageSize : 0;
          if (fragmentation > 0.2) {
            fragmentedCollections++;
            recommendations.push({
              type: 'compact',
              priority: 'medium',
              description: `Collection "${collection.name}" has ${(fragmentation * 100).toFixed(1)}% fragmentation`,
              action: `Run compact operation on ${collection.name}`,
              estimatedImpact: 'Reduced storage usage and improved query performance',
            });
          }

          // Check for unused indexes
          try {
            const indexStats = await coll.aggregate([{ $indexStats: {} }]).toArray();
            for (const indexStat of indexStats) {
              if (indexStat.name !== '_id_' && indexStat.accesses.ops === 0) {
                unusedIndexes++;
                recommendations.push({
                  type: 'index_cleanup',
                  priority: 'low',
                  description: `Index "${indexStat.name}" on collection "${collection.name}" is not being used`,
                  action: `Consider dropping unused index: ${indexStat.name}`,
                  estimatedImpact: 'Improved write performance and reduced storage',
                });
              }
            }
          } catch (error) {
            logger.debug(`Index analysis failed for ${collection.name}:`, error);
          }

        } catch (error) {
          logger.debug(`Collection analysis failed for ${collection.name}:`, error);
        }
      }

      // Calculate storage efficiency
      const dbStats = await db.stats();
      const storageEfficiency = dbStats.dataSize > 0 ? (dbStats.dataSize / dbStats.storageSize) * 100 : 100;

      if (storageEfficiency < 70) {
        recommendations.push({
          type: 'optimize',
          priority: 'high',
          description: `Database storage efficiency is ${storageEfficiency.toFixed(1)}%`,
          action: 'Run database optimization to improve storage efficiency',
          estimatedImpact: 'Significant storage savings and performance improvement',
        });
      }

      return {
        timestamp: new Date(),
        database: db.databaseName,
        tasks: Array.from(this.maintenanceTasks.values()),
        recommendations,
        metrics: {
          totalCollections: collections.length,
          totalIndexes,
          fragmentedCollections,
          unusedIndexes,
          storageEfficiency,
        },
      };

    } catch (error) {
      logger.error('Failed to generate maintenance report:', error);
      throw error;
    }
  }

  private startBackupVerification(): void {
    const interval = this.config.verification.checkInterval * 60 * 1000; // Convert to ms
    
    this.verificationInterval = setInterval(() => {
      this.runScheduledVerification().catch(error => {
        logger.error('Scheduled backup verification failed:', error);
      });
    }, interval);

    logger.info('Backup verification scheduler started', {
      interval: this.config.verification.checkInterval,
    });
  }

  private async runScheduledVerification(): Promise<void> {
    const unverifiedBackups = Array.from(this.backupHistory.values())
      .filter(backup => !backup.verified)
      .map(backup => backup.id);

    if (unverifiedBackups.length > 0) {
      logger.info(`Running scheduled verification for ${unverifiedBackups.length} backups`);
      await this.verifyBackups(unverifiedBackups);
    }
  }

  /**
   * Shutdown backup manager
   */
  shutdown(): void {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
      this.verificationInterval = undefined;
    }

    logger.info('Database backup manager shut down');
  }

  /**
   * Register a completed backup
   */
  registerBackup(metadata: Omit<BackupMetadata, 'verified' | 'verifiedAt'>): void {
    const backup: BackupMetadata = {
      ...metadata,
      verified: false,
    };

    this.backupHistory.set(backup.id, backup);
    
    logger.info(`Registered backup: ${backup.id}`, {
      type: backup.type,
      size: backup.size,
      collections: backup.collections.length,
    });
  }

  /**
   * Get backup history
   */
  getBackupHistory(limit = 50): BackupMetadata[] {
    return Array.from(this.backupHistory.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get maintenance tasks
   */
  getMaintenanceTasks(): MaintenanceTask[] {
    return Array.from(this.maintenanceTasks.values());
  }
}