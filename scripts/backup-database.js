#!/usr/bin/env node

/**
 * Database Backup Script
 * Automated MongoDB backup with compression, encryption, and cloud storage
 */

const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { createGzip } = require('zlib');
const { createReadStream, createWriteStream } = require('fs');

class DatabaseBackupManager {
  constructor(config = {}) {
    this.config = {
      // MongoDB settings
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      database: process.env.DATABASE_NAME || 'strive',
      
      // Backup settings
      backupDir: path.join(process.cwd(), 'backups'),
      retention: {
        daily: 7,    // Keep 7 daily backups
        weekly: 4,   // Keep 4 weekly backups
        monthly: 12  // Keep 12 monthly backups
      },
      
      // Compression and encryption
      compress: true,
      encrypt: process.env.BACKUP_ENCRYPTION === 'true',
      encryptionKey: process.env.BACKUP_ENCRYPTION_KEY,
      
      // Cloud storage (optional)
      cloudStorage: {
        enabled: process.env.CLOUD_BACKUP_ENABLED === 'true',
        provider: process.env.CLOUD_STORAGE_PROVIDER || 'aws', // aws, gcp, azure
        bucket: process.env.BACKUP_BUCKET,
        region: process.env.BACKUP_REGION || 'us-east-1'
      },
      
      // Notifications
      notifications: {
        enabled: process.env.BACKUP_NOTIFICATIONS === 'true',
        email: process.env.BACKUP_NOTIFICATION_EMAIL,
        webhook: process.env.BACKUP_WEBHOOK_URL
      },
      
      ...config
    };
    
    this.logger = this.createLogger();
  }
  
  createLogger() {
    return {
      info: (msg, meta = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta);
      },
      error: (msg, error = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error);
      },
      warn: (msg, meta = {}) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta);
      }
    };
  }
  
  /**
   * Main backup orchestration method
   */
  async createBackup(options = {}) {
    const backupId = this.generateBackupId();
    const startTime = Date.now();
    
    try {
      this.logger.info('Starting database backup', { backupId });
      
      // Ensure backup directory exists
      await this.ensureBackupDirectory();
      
      // Create the backup
      const backupPath = await this.performMongoDump(backupId);
      
      // Process the backup (compress, encrypt)
      const processedPath = await this.processBackup(backupPath, backupId);
      
      // Verify backup integrity
      await this.verifyBackup(processedPath);
      
      // Upload to cloud storage if configured
      if (this.config.cloudStorage.enabled) {
        await this.uploadToCloud(processedPath, backupId);
      }
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      // Generate backup report
      const report = await this.generateBackupReport(backupId, startTime, processedPath);
      
      // Send notifications
      if (this.config.notifications.enabled) {
        await this.sendNotification('success', report);
      }
      
      this.logger.info('Backup completed successfully', { 
        backupId, 
        duration: Date.now() - startTime,
        path: processedPath
      });
      
      return report;
      
    } catch (error) {
      this.logger.error('Backup failed', { backupId, error: error.message });
      
      if (this.config.notifications.enabled) {
        await this.sendNotification('error', {
          backupId,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      throw error;
    }
  }
  
  /**
   * Generate unique backup ID
   */
  generateBackupId() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const randomStr = crypto.randomBytes(4).toString('hex');
    
    return `${this.config.database}-${dateStr}-${timeStr}-${randomStr}`;
  }
  
  /**
   * Ensure backup directory structure exists
   */
  async ensureBackupDirectory() {
    const dirs = [
      this.config.backupDir,
      path.join(this.config.backupDir, 'daily'),
      path.join(this.config.backupDir, 'weekly'),
      path.join(this.config.backupDir, 'monthly')
    ];
    
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        this.logger.info('Created backup directory', { dir });
      }
    }
  }
  
  /**
   * Perform MongoDB dump using mongodump
   */
  async performMongoDump(backupId) {
    const outputDir = path.join(this.config.backupDir, 'temp', backupId);
    
    // Ensure temp directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    const mongodumpArgs = [
      '--uri', this.config.mongoUrl,
      '--db', this.config.database,
      '--out', outputDir
    ];
    
    // Add additional options
    if (process.env.MONGO_OPLOG === 'true') {
      mongodumpArgs.push('--oplog');
    }
    
    if (process.env.MONGO_GZIP === 'true') {
      mongodumpArgs.push('--gzip');
    }
    
    return new Promise((resolve, reject) => {
      const mongodump = spawn('mongodump', mongodumpArgs);
      
      let stderr = '';
      
      mongodump.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      mongodump.on('close', (code) => {
        if (code === 0) {
          this.logger.info('MongoDB dump completed', { backupId, outputDir });
          resolve(path.join(outputDir, this.config.database));
        } else {
          reject(new Error(`mongodump failed with code ${code}: ${stderr}`));
        }
      });
      
      mongodump.on('error', (error) => {
        reject(new Error(`mongodump spawn error: ${error.message}`));
      });
    });
  }
  
  /**
   * Process backup (compress and/or encrypt)
   */
  async processBackup(backupPath, backupId) {
    let processedPath = backupPath;
    
    // Create archive from directory
    const archivePath = path.join(this.config.backupDir, 'temp', `${backupId}.tar`);
    await this.createTarArchive(backupPath, archivePath);
    processedPath = archivePath;
    
    // Compress if enabled
    if (this.config.compress) {
      const compressedPath = `${archivePath}.gz`;
      await this.compressFile(archivePath, compressedPath);
      await fs.unlink(archivePath); // Remove uncompressed version
      processedPath = compressedPath;
      this.logger.info('Backup compressed', { backupId, path: compressedPath });
    }
    
    // Encrypt if enabled
    if (this.config.encrypt && this.config.encryptionKey) {
      const encryptedPath = `${processedPath}.enc`;
      await this.encryptFile(processedPath, encryptedPath);
      await fs.unlink(processedPath); // Remove unencrypted version
      processedPath = encryptedPath;
      this.logger.info('Backup encrypted', { backupId, path: encryptedPath });
    }
    
    // Move to appropriate retention directory
    const finalPath = await this.moveToRetentionDirectory(processedPath, backupId);
    
    // Cleanup temp directory
    await fs.rm(path.dirname(backupPath), { recursive: true, force: true });
    
    return finalPath;
  }
  
  /**
   * Create tar archive from directory
   */
  async createTarArchive(sourceDir, targetPath) {
    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-cf', targetPath, '-C', path.dirname(sourceDir), path.basename(sourceDir)]);
      
      tar.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`tar failed with code ${code}`));
        }
      });
      
      tar.on('error', reject);
    });
  }
  
  /**
   * Compress file using gzip
   */
  async compressFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(inputPath);
      const writeStream = createWriteStream(outputPath);
      const gzip = createGzip({ level: 9 });
      
      readStream
        .pipe(gzip)
        .pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });
  }
  
  /**
   * Encrypt file using AES-256-GCM
   */
  async encryptFile(inputPath, outputPath) {
    const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipherGCM('aes-256-gcm', key, iv);
    
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(inputPath);
      const writeStream = createWriteStream(outputPath);
      
      // Write IV to beginning of encrypted file
      writeStream.write(iv);
      
      readStream
        .pipe(cipher)
        .pipe(writeStream)
        .on('finish', () => {
          // Append auth tag
          const authTag = cipher.getAuthTag();
          writeStream.write(authTag);
          writeStream.end();
          resolve();
        })
        .on('error', reject);
    });
  }
  
  /**
   * Move backup to appropriate retention directory
   */
  async moveToRetentionDirectory(backupPath, backupId) {
    const now = new Date();
    const isWeekly = now.getDay() === 0; // Sunday
    const isMonthly = now.getDate() === 1; // First day of month
    
    let targetDir = 'daily';
    if (isMonthly) {
      targetDir = 'monthly';
    } else if (isWeekly) {
      targetDir = 'weekly';
    }
    
    const finalPath = path.join(this.config.backupDir, targetDir, path.basename(backupPath));
    await fs.rename(backupPath, finalPath);
    
    this.logger.info('Backup moved to retention directory', { 
      backupId, 
      type: targetDir,
      path: finalPath 
    });
    
    return finalPath;
  }
  
  /**
   * Verify backup integrity
   */
  async verifyBackup(backupPath) {
    try {
      const stats = await fs.stat(backupPath);
      
      if (stats.size === 0) {
        throw new Error('Backup file is empty');
      }
      
      // Calculate checksum
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(backupPath);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => {
          const checksum = hash.digest('hex');
          
          // Save checksum file
          const checksumPath = `${backupPath}.sha256`;
          fs.writeFile(checksumPath, checksum)
            .then(() => {
              this.logger.info('Backup verification completed', {
                path: backupPath,
                size: stats.size,
                checksum
              });
              resolve({ size: stats.size, checksum });
            })
            .catch(reject);
        });
        stream.on('error', reject);
      });
      
    } catch (error) {
      throw new Error(`Backup verification failed: ${error.message}`);
    }
  }
  
  /**
   * Upload backup to cloud storage
   */
  async uploadToCloud(backupPath, backupId) {
    const provider = this.config.cloudStorage.provider;
    
    this.logger.info('Starting cloud upload', { provider, backupId });
    
    try {
      switch (provider) {
        case 'aws':
          await this.uploadToAWS(backupPath, backupId);
          break;
        case 'gcp':
          await this.uploadToGCP(backupPath, backupId);
          break;
        case 'azure':
          await this.uploadToAzure(backupPath, backupId);
          break;
        default:
          throw new Error(`Unsupported cloud provider: ${provider}`);
      }
      
      this.logger.info('Cloud upload completed', { provider, backupId });
      
    } catch (error) {
      this.logger.error('Cloud upload failed', { provider, backupId, error: error.message });
      throw error;
    }
  }
  
  /**
   * Upload to AWS S3
   */
  async uploadToAWS(backupPath, backupId) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({ region: this.config.cloudStorage.region });
    
    const fileStream = createReadStream(backupPath);
    const uploadParams = {
      Bucket: this.config.cloudStorage.bucket,
      Key: `backups/${backupId}/${path.basename(backupPath)}`,
      Body: fileStream,
      StorageClass: 'STANDARD_IA', // Infrequent Access for backups
      ServerSideEncryption: 'AES256'
    };
    
    return s3.upload(uploadParams).promise();
  }
  
  /**
   * Upload to Google Cloud Storage
   */
  async uploadToGCP(backupPath, backupId) {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    const bucket = storage.bucket(this.config.cloudStorage.bucket);
    
    const destination = `backups/${backupId}/${path.basename(backupPath)}`;
    
    return bucket.upload(backupPath, {
      destination,
      metadata: {
        storageClass: 'NEARLINE', // Cost-effective for backups
        cacheControl: 'private, max-age=0'
      }
    });
  }
  
  /**
   * Upload to Azure Blob Storage
   */
  async uploadToAzure(backupPath, backupId) {
    const { BlobServiceClient } = require('@azure/storage-blob');
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    
    const containerClient = blobServiceClient.getContainerClient(this.config.cloudStorage.bucket);
    const blobName = `backups/${backupId}/${path.basename(backupPath)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    const fileStream = createReadStream(backupPath);
    return blockBlobClient.uploadStream(fileStream);
  }
  
  /**
   * Clean up old backups based on retention policy
   */
  async cleanupOldBackups() {
    for (const [type, retentionDays] of Object.entries(this.config.retention)) {
      const backupDir = path.join(this.config.backupDir, type);
      
      try {
        const files = await fs.readdir(backupDir);
        const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
        
        for (const file of files) {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            await fs.unlink(filePath);
            
            // Also remove checksum file if exists
            const checksumPath = `${filePath}.sha256`;
            try {
              await fs.unlink(checksumPath);
            } catch {} // Ignore if doesn't exist
            
            this.logger.info('Cleaned up old backup', { type, file: filePath });
          }
        }
      } catch (error) {
        this.logger.warn('Cleanup failed for backup type', { type, error: error.message });
      }
    }
  }
  
  /**
   * Generate backup report
   */
  async generateBackupReport(backupId, startTime, backupPath) {
    const stats = await fs.stat(backupPath);
    const duration = Date.now() - startTime;
    
    const report = {
      backupId,
      timestamp: new Date().toISOString(),
      duration,
      database: this.config.database,
      size: stats.size,
      sizeHuman: this.formatBytes(stats.size),
      path: backupPath,
      compressed: this.config.compress,
      encrypted: this.config.encrypt && !!this.config.encryptionKey,
      cloudUploaded: this.config.cloudStorage.enabled,
      cloudProvider: this.config.cloudStorage.provider,
      status: 'success'
    };
    
    // Save report to file
    const reportPath = path.join(this.config.backupDir, 'reports', `${backupId}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }
  
  /**
   * Send notifications about backup status
   */
  async sendNotification(status, data) {
    const message = this.formatNotificationMessage(status, data);
    
    // Email notification
    if (this.config.notifications.email) {
      await this.sendEmailNotification(message);
    }
    
    // Webhook notification
    if (this.config.notifications.webhook) {
      await this.sendWebhookNotification(message);
    }
  }
  
  /**
   * Format notification message
   */
  formatNotificationMessage(status, data) {
    const timestamp = new Date().toISOString();
    
    if (status === 'success') {
      return {
        subject: `✅ Database Backup Successful - ${data.backupId}`,
        message: `Database backup completed successfully.
        
Backup Details:
- Backup ID: ${data.backupId}
- Database: ${data.database}
- Size: ${data.sizeHuman}
- Duration: ${Math.round(data.duration / 1000)}s
- Compressed: ${data.compressed ? 'Yes' : 'No'}
- Encrypted: ${data.encrypted ? 'Yes' : 'No'}
- Cloud Upload: ${data.cloudUploaded ? `Yes (${data.cloudProvider})` : 'No'}
- Timestamp: ${timestamp}`,
        data,
        status
      };
    } else {
      return {
        subject: `❌ Database Backup Failed - ${data.backupId}`,
        message: `Database backup failed.
        
Error Details:
- Backup ID: ${data.backupId}
- Error: ${data.error}
- Timestamp: ${timestamp}

Please check the backup system immediately.`,
        data,
        status
      };
    }
  }
  
  /**
   * Send email notification
   */
  async sendEmailNotification(message) {
    // Implementation depends on your email service
    // This is a placeholder for email notification logic
    this.logger.info('Email notification sent', { 
      to: this.config.notifications.email,
      subject: message.subject 
    });
  }
  
  /**
   * Send webhook notification
   */
  async sendWebhookNotification(message) {
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch(this.config.notifications.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
      
      this.logger.info('Webhook notification sent', { url: this.config.notifications.webhook });
      
    } catch (error) {
      this.logger.error('Webhook notification failed', { error: error.message });
    }
  }
  
  /**
   * Format bytes to human readable string
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  /**
   * List available backups
   */
  async listBackups() {
    const backups = { daily: [], weekly: [], monthly: [] };
    
    for (const type of Object.keys(backups)) {
      const dir = path.join(this.config.backupDir, type);
      
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          if (file.endsWith('.sha256')) continue; // Skip checksum files
          
          const filePath = path.join(dir, file);
          const stats = await fs.stat(filePath);
          
          backups[type].push({
            filename: file,
            path: filePath,
            size: stats.size,
            sizeHuman: this.formatBytes(stats.size),
            created: stats.birthtime,
            modified: stats.mtime
          });
        }
        
        // Sort by creation time (newest first)
        backups[type].sort((a, b) => b.created - a.created);
        
      } catch (error) {
        this.logger.warn(`Failed to list ${type} backups`, { error: error.message });
      }
    }
    
    return backups;
  }
  
  /**
   * Restore from backup
   */
  async restoreFromBackup(backupPath, targetDatabase = null) {
    const restoreDb = targetDatabase || `${this.config.database}_restored_${Date.now()}`;
    
    this.logger.info('Starting backup restoration', { backupPath, targetDatabase: restoreDb });
    
    try {
      // Decrypt if needed
      let processedPath = backupPath;
      if (backupPath.endsWith('.enc')) {
        processedPath = await this.decryptFile(backupPath);
      }
      
      // Decompress if needed
      if (processedPath.endsWith('.gz')) {
        processedPath = await this.decompressFile(processedPath);
      }
      
      // Extract if needed
      if (processedPath.endsWith('.tar')) {
        processedPath = await this.extractTarArchive(processedPath);
      }
      
      // Perform mongorestore
      await this.performMongoRestore(processedPath, restoreDb);
      
      this.logger.info('Backup restoration completed', { backupPath, targetDatabase: restoreDb });
      
      return { success: true, database: restoreDb };
      
    } catch (error) {
      this.logger.error('Backup restoration failed', { backupPath, error: error.message });
      throw error;
    }
  }
  
  /**
   * Perform MongoDB restore using mongorestore
   */
  async performMongoRestore(backupPath, targetDatabase) {
    const mongorestoreArgs = [
      '--uri', this.config.mongoUrl,
      '--db', targetDatabase,
      '--dir', backupPath
    ];
    
    return new Promise((resolve, reject) => {
      const mongorestore = spawn('mongorestore', mongorestoreArgs);
      
      let stderr = '';
      
      mongorestore.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      mongorestore.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`mongorestore failed with code ${code}: ${stderr}`));
        }
      });
      
      mongorestore.on('error', (error) => {
        reject(new Error(`mongorestore spawn error: ${error.message}`));
      });
    });
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const backupManager = new DatabaseBackupManager();
  
  async function runCommand() {
    try {
      switch (command) {
        case 'backup':
          await backupManager.createBackup();
          break;
          
        case 'list':
          const backups = await backupManager.listBackups();
          console.log(JSON.stringify(backups, null, 2));
          break;
          
        case 'restore':
          if (args.length < 2) {
            throw new Error('Restore requires backup path: npm run backup restore <backup-path>');
          }
          await backupManager.restoreFromBackup(args[1], args[2]);
          break;
          
        case 'help':
        default:
          console.log(`
Database Backup Manager

Usage:
  node scripts/backup-database.js <command>

Commands:
  backup              Create a new backup
  list                List available backups
  restore <path>      Restore from backup
  help                Show this help

Environment Variables:
  MONGODB_URI                 MongoDB connection string
  DATABASE_NAME              Database name to backup
  BACKUP_ENCRYPTION          Enable backup encryption (true/false)
  BACKUP_ENCRYPTION_KEY      Encryption key for backups
  CLOUD_BACKUP_ENABLED       Enable cloud storage (true/false)
  CLOUD_STORAGE_PROVIDER     Cloud provider (aws/gcp/azure)
  BACKUP_BUCKET             Cloud storage bucket name
  BACKUP_NOTIFICATIONS       Enable notifications (true/false)
  BACKUP_NOTIFICATION_EMAIL  Email for notifications
  BACKUP_WEBHOOK_URL         Webhook URL for notifications

Examples:
  npm run backup
  npm run backup:list
  npm run backup:restore /path/to/backup.tar.gz
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

module.exports = DatabaseBackupManager;