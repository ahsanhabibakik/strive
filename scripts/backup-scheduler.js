#!/usr/bin/env node

/**
 * Backup Scheduler
 * Cron-like scheduler for automated database backups
 */

const cron = require('node-cron');
const DatabaseBackupManager = require('./backup-database');
const fs = require('fs').promises;
const path = require('path');

class BackupScheduler {
  constructor(config = {}) {
    this.config = {
      // Default schedule configurations
      schedules: {
        daily: '0 2 * * *',     // 2 AM daily
        weekly: '0 3 * * 0',    // 3 AM on Sundays
        monthly: '0 4 1 * *',   // 4 AM on 1st of month
      },
      
      // Backup profiles for different schedules
      profiles: {
        daily: {
          compress: true,
          encrypt: false,
          cloudStorage: { enabled: false },
          retention: { daily: 7, weekly: 0, monthly: 0 }
        },
        weekly: {
          compress: true,
          encrypt: true,
          cloudStorage: { enabled: true },
          retention: { daily: 0, weekly: 4, monthly: 0 }
        },
        monthly: {
          compress: true,
          encrypt: true,
          cloudStorage: { enabled: true },
          retention: { daily: 0, weekly: 0, monthly: 12 }
        }
      },
      
      // Scheduler settings
      timezone: process.env.BACKUP_TIMEZONE || 'UTC',
      maxConcurrent: 1,
      lockFile: path.join(process.cwd(), '.backup-scheduler.lock'),
      logFile: path.join(process.cwd(), 'logs', 'backup-scheduler.log'),
      
      // Monitoring
      healthCheck: {
        enabled: process.env.BACKUP_HEALTH_CHECK === 'true',
        url: process.env.BACKUP_HEALTH_CHECK_URL,
        timeout: 30000
      },
      
      ...config
    };
    
    this.tasks = new Map();
    this.running = false;
    this.currentBackup = null;
    this.logger = this.createLogger();
    this.stats = {
      totalBackups: 0,
      successfulBackups: 0,
      failedBackups: 0,
      lastBackup: null,
      nextScheduled: null
    };
  }
  
  createLogger() {
    return {
      info: (msg, meta = {}) => {
        const logEntry = `[SCHEDULER-INFO] ${new Date().toISOString()} - ${msg} ${JSON.stringify(meta)}`;
        console.log(logEntry);
        this.writeToLogFile(logEntry);
      },
      error: (msg, error = {}) => {
        const logEntry = `[SCHEDULER-ERROR] ${new Date().toISOString()} - ${msg} ${JSON.stringify(error)}`;
        console.error(logEntry);
        this.writeToLogFile(logEntry);
      },
      warn: (msg, meta = {}) => {
        const logEntry = `[SCHEDULER-WARN] ${new Date().toISOString()} - ${msg} ${JSON.stringify(meta)}`;
        console.warn(logEntry);
        this.writeToLogFile(logEntry);
      }
    };
  }
  
  async writeToLogFile(entry) {
    try {
      await fs.mkdir(path.dirname(this.config.logFile), { recursive: true });
      await fs.appendFile(this.config.logFile, entry + '\n');
    } catch (error) {
      // Ignore log file errors
    }
  }
  
  /**
   * Start the backup scheduler
   */
  async start() {
    if (this.running) {
      this.logger.warn('Scheduler is already running');
      return;
    }
    
    try {
      // Check for existing lock file
      await this.checkLockFile();
      
      // Create lock file
      await this.createLockFile();
      
      // Setup scheduled tasks
      this.setupScheduledTasks();
      
      // Setup process handlers
      this.setupProcessHandlers();
      
      // Start health check if enabled
      if (this.config.healthCheck.enabled) {
        this.startHealthCheck();
      }
      
      this.running = true;
      this.logger.info('Backup scheduler started', { 
        schedules: Object.keys(this.config.schedules),
        timezone: this.config.timezone
      });
      
    } catch (error) {
      this.logger.error('Failed to start scheduler', { error: error.message });
      throw error;
    }
  }
  
  /**
   * Stop the backup scheduler
   */
  async stop() {
    if (!this.running) {
      return;
    }
    
    this.logger.info('Stopping backup scheduler');
    
    // Stop all scheduled tasks
    for (const [name, task] of this.tasks) {
      task.stop();
      this.logger.info('Stopped scheduled task', { name });
    }
    this.tasks.clear();
    
    // Wait for current backup to finish
    if (this.currentBackup) {
      this.logger.info('Waiting for current backup to finish');
      try {
        await this.currentBackup;
      } catch (error) {
        this.logger.error('Current backup failed during shutdown', { error: error.message });
      }
    }
    
    // Remove lock file
    await this.removeLockFile();
    
    this.running = false;
    this.logger.info('Backup scheduler stopped');
  }
  
  /**
   * Setup scheduled backup tasks
   */
  setupScheduledTasks() {
    for (const [type, schedule] of Object.entries(this.config.schedules)) {
      const task = cron.schedule(schedule, async () => {
        await this.executeScheduledBackup(type);
      }, {
        scheduled: false,
        timezone: this.config.timezone
      });
      
      this.tasks.set(type, task);
      task.start();
      
      this.logger.info('Scheduled backup task', { 
        type, 
        schedule, 
        nextRun: this.getNextRunTime(schedule)
      });
    }
    
    // Update next scheduled time
    this.updateNextScheduledTime();
  }
  
  /**
   * Execute a scheduled backup
   */
  async executeScheduledBackup(type) {
    if (this.currentBackup) {
      this.logger.warn('Skipping scheduled backup - another backup is in progress', { type });
      return;
    }
    
    const startTime = Date.now();
    this.stats.totalBackups++;
    
    this.logger.info('Starting scheduled backup', { type });
    
    try {
      // Create backup manager with profile settings
      const profile = this.config.profiles[type] || {};
      const backupManager = new DatabaseBackupManager(profile);
      
      // Execute backup
      this.currentBackup = backupManager.createBackup({ 
        type, 
        scheduled: true 
      });
      
      const result = await this.currentBackup;
      
      // Update statistics
      this.stats.successfulBackups++;
      this.stats.lastBackup = {
        type,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        status: 'success',
        backupId: result.backupId,
        size: result.size
      };
      
      this.logger.info('Scheduled backup completed successfully', { 
        type, 
        duration: Date.now() - startTime,
        backupId: result.backupId
      });
      
      // Send health check ping
      if (this.config.healthCheck.enabled) {
        await this.sendHealthCheckPing('success', { type, result });
      }
      
    } catch (error) {
      this.stats.failedBackups++;
      this.stats.lastBackup = {
        type,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        status: 'failed',
        error: error.message
      };
      
      this.logger.error('Scheduled backup failed', { 
        type, 
        error: error.message,
        duration: Date.now() - startTime
      });
      
      // Send health check ping
      if (this.config.healthCheck.enabled) {
        await this.sendHealthCheckPing('failure', { type, error: error.message });
      }
      
    } finally {
      this.currentBackup = null;
      this.updateNextScheduledTime();
    }
  }
  
  /**
   * Setup process signal handlers
   */
  setupProcessHandlers() {
    process.on('SIGTERM', async () => {
      this.logger.info('Received SIGTERM, shutting down gracefully');
      await this.stop();
      process.exit(0);
    });
    
    process.on('SIGINT', async () => {
      this.logger.info('Received SIGINT, shutting down gracefully');
      await this.stop();
      process.exit(0);
    });
    
    process.on('uncaughtException', (error) => {
      this.logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error('Unhandled promise rejection', { reason, promise });
      process.exit(1);
    });
  }
  
  /**
   * Check for existing lock file
   */
  async checkLockFile() {
    try {
      const lockData = await fs.readFile(this.config.lockFile, 'utf8');
      const lock = JSON.parse(lockData);
      
      // Check if the process is still running
      try {
        process.kill(lock.pid, 0);
        throw new Error(`Another scheduler instance is running (PID: ${lock.pid})`);
      } catch (killError) {
        if (killError.code === 'ESRCH') {
          // Process not found, remove stale lock file
          await fs.unlink(this.config.lockFile);
          this.logger.info('Removed stale lock file');
        } else {
          throw killError;
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // Lock file doesn't exist, which is fine
    }
  }
  
  /**
   * Create lock file
   */
  async createLockFile() {
    const lockData = {
      pid: process.pid,
      started: new Date().toISOString(),
      hostname: require('os').hostname()
    };
    
    await fs.writeFile(this.config.lockFile, JSON.stringify(lockData, null, 2));
  }
  
  /**
   * Remove lock file
   */
  async removeLockFile() {
    try {
      await fs.unlink(this.config.lockFile);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.warn('Failed to remove lock file', { error: error.message });
      }
    }
  }
  
  /**
   * Get next run time for a cron schedule
   */
  getNextRunTime(schedule) {
    const cronParser = require('node-cron');
    
    try {
      // This is a simplified implementation
      // In a real scenario, you'd use a proper cron parser
      return 'Next run time calculation not implemented';
    } catch (error) {
      return 'Unknown';
    }
  }
  
  /**
   * Update next scheduled backup time
   */
  updateNextScheduledTime() {
    // Find the next scheduled backup across all tasks
    let nextScheduled = null;
    
    for (const [type, schedule] of Object.entries(this.config.schedules)) {
      // Calculate next run time for this schedule
      // This would use a proper cron parser in production
      const nextRun = this.getNextRunTime(schedule);
      
      if (!nextScheduled || (nextRun && nextRun < nextScheduled)) {
        nextScheduled = nextRun;
      }
    }
    
    this.stats.nextScheduled = nextScheduled;
  }
  
  /**
   * Start health check monitoring
   */
  startHealthCheck() {
    // Send periodic health check pings
    setInterval(async () => {
      await this.sendHealthCheckPing('heartbeat', {
        status: this.running ? 'running' : 'stopped',
        stats: this.stats,
        currentBackup: !!this.currentBackup
      });
    }, 5 * 60 * 1000); // Every 5 minutes
  }
  
  /**
   * Send health check ping
   */
  async sendHealthCheckPing(event, data = {}) {
    if (!this.config.healthCheck.enabled || !this.config.healthCheck.url) {
      return;
    }
    
    try {
      const fetch = require('node-fetch');
      
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        scheduler: {
          running: this.running,
          stats: this.stats
        },
        ...data
      };
      
      const response = await fetch(this.config.healthCheck.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: this.config.healthCheck.timeout
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
    } catch (error) {
      this.logger.warn('Health check ping failed', { 
        event, 
        error: error.message 
      });
    }
  }
  
  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      running: this.running,
      stats: this.stats,
      schedules: Object.keys(this.config.schedules),
      currentBackup: !!this.currentBackup,
      uptime: process.uptime(),
      pid: process.pid
    };
  }
  
  /**
   * Run backup immediately (manual trigger)
   */
  async runBackupNow(type = 'manual') {
    if (this.currentBackup) {
      throw new Error('Another backup is already in progress');
    }
    
    this.logger.info('Starting manual backup', { type });
    
    const profile = this.config.profiles.daily || {}; // Use daily profile as default
    const backupManager = new DatabaseBackupManager(profile);
    
    return await backupManager.createBackup({ 
      type, 
      manual: true 
    });
  }
  
  /**
   * Update schedule configuration
   */
  updateSchedule(type, newSchedule) {
    if (!this.running) {
      throw new Error('Scheduler is not running');
    }
    
    // Stop existing task
    if (this.tasks.has(type)) {
      this.tasks.get(type).stop();
      this.tasks.delete(type);
    }
    
    // Create new task
    const task = cron.schedule(newSchedule, async () => {
      await this.executeScheduledBackup(type);
    }, {
      scheduled: true,
      timezone: this.config.timezone
    });
    
    this.tasks.set(type, task);
    this.config.schedules[type] = newSchedule;
    
    this.logger.info('Updated backup schedule', { 
      type, 
      schedule: newSchedule 
    });
    
    this.updateNextScheduledTime();
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const scheduler = new BackupScheduler();
  
  async function runCommand() {
    try {
      switch (command) {
        case 'start':
          await scheduler.start();
          
          // Keep process alive
          process.on('SIGTERM', async () => {
            await scheduler.stop();
            process.exit(0);
          });
          
          break;
          
        case 'stop':
          // Stop any running scheduler
          try {
            const lockFile = path.join(process.cwd(), '.backup-scheduler.lock');
            const lockData = JSON.parse(await fs.readFile(lockFile, 'utf8'));
            process.kill(lockData.pid, 'SIGTERM');
            console.log('Sent stop signal to scheduler');
          } catch (error) {
            console.log('No running scheduler found');
          }
          break;
          
        case 'status':
          try {
            const lockFile = path.join(process.cwd(), '.backup-scheduler.lock');
            const lockData = JSON.parse(await fs.readFile(lockFile, 'utf8'));
            console.log('Scheduler is running');
            console.log(JSON.stringify(lockData, null, 2));
          } catch (error) {
            console.log('Scheduler is not running');
          }
          break;
          
        case 'run-now':
          const tempScheduler = new BackupScheduler();
          const result = await tempScheduler.runBackupNow(args[1] || 'manual');
          console.log('Manual backup completed:');
          console.log(JSON.stringify(result, null, 2));
          break;
          
        case 'help':
        default:
          console.log(`
Backup Scheduler

Usage:
  node scripts/backup-scheduler.js <command>

Commands:
  start                Start the backup scheduler daemon
  stop                 Stop the running backup scheduler
  status               Show scheduler status
  run-now [type]       Run backup immediately
  help                 Show this help

Environment Variables:
  BACKUP_TIMEZONE              Timezone for schedules (default: UTC)
  BACKUP_HEALTH_CHECK         Enable health checks (true/false)
  BACKUP_HEALTH_CHECK_URL     Health check webhook URL

Default Schedules:
  Daily:   2 AM every day
  Weekly:  3 AM every Sunday
  Monthly: 4 AM on 1st of month

Examples:
  npm run backup:schedule        # Start scheduler
  npm run backup:stop           # Stop scheduler
  npm run backup:status         # Check status
  npm run backup:now            # Run backup now
          `);
          break;
      }
    } catch (error) {
      console.error('Command failed:', error.message);
      process.exit(1);
    }
  }
  
  runCommand();
}

module.exports = BackupScheduler;