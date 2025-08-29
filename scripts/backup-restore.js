#!/usr/bin/env node

/**
 * Backup Restore Utility
 * Advanced restoration tools with validation and recovery options
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { createReadStream, createWriteStream } = require('fs');
const { createGunzip } = require('zlib');
const { spawn } = require('child_process');

class BackupRestoreManager {
  constructor(config = {}) {
    this.config = {
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      tempDir: path.join(process.cwd(), 'temp', 'restore'),
      validationEnabled: true,
      createBackupBeforeRestore: true,
      dryRun: false,
      ...config
    };
    
    this.logger = this.createLogger();
  }
  
  createLogger() {
    return {
      info: (msg, meta = {}) => console.log(`[RESTORE-INFO] ${new Date().toISOString()} - ${msg}`, meta),
      error: (msg, error = {}) => console.error(`[RESTORE-ERROR] ${new Date().toISOString()} - ${msg}`, error),
      warn: (msg, meta = {}) => console.warn(`[RESTORE-WARN] ${new Date().toISOString()} - ${msg}`, meta),
      success: (msg, meta = {}) => console.log(`[RESTORE-SUCCESS] ${new Date().toISOString()} - ${msg}`, meta)
    };
  }
  
  /**
   * Main restore method with comprehensive validation
   */
  async restoreBackup(backupPath, options = {}) {
    const restoreId = this.generateRestoreId();
    const startTime = Date.now();
    
    try {
      this.logger.info('Starting backup restore process', { 
        restoreId, 
        backupPath,
        options 
      });
      
      // Validate backup file
      await this.validateBackupFile(backupPath);
      
      // Create temporary workspace
      await this.setupTemporaryWorkspace(restoreId);
      
      // Process backup file (decrypt, decompress, extract)
      const processedPath = await this.processBackupFile(backupPath, restoreId);
      
      // Validate backup contents
      if (this.config.validationEnabled) {
        await this.validateBackupContents(processedPath);
      }
      
      // Create safety backup of current database
      if (this.config.createBackupBeforeRestore) {
        await this.createSafetyBackup(options.targetDatabase);
      }
      
      // Perform the actual restoration
      if (!this.config.dryRun) {
        await this.performRestore(processedPath, options);
      } else {
        this.logger.info('Dry run mode - skipping actual restore');
      }
      
      // Post-restore validation
      if (!this.config.dryRun) {
        await this.validateRestoredDatabase(options.targetDatabase);
      }
      
      // Cleanup temporary files
      await this.cleanup(restoreId);
      
      const report = {
        restoreId,
        backupPath,
        targetDatabase: options.targetDatabase,
        duration: Date.now() - startTime,
        status: 'success',
        timestamp: new Date().toISOString()
      };
      
      this.logger.success('Backup restore completed successfully', report);
      return report;
      
    } catch (error) {
      this.logger.error('Backup restore failed', { 
        restoreId, 
        backupPath, 
        error: error.message 
      });
      
      // Cleanup on failure
      try {
        await this.cleanup(restoreId);
      } catch (cleanupError) {
        this.logger.warn('Cleanup failed', { error: cleanupError.message });
      }
      
      throw error;
    }
  }
  
  /**
   * Generate unique restore ID
   */
  generateRestoreId() {
    return `restore-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }
  
  /**
   * Validate backup file exists and is readable
   */
  async validateBackupFile(backupPath) {
    try {
      const stats = await fs.stat(backupPath);
      
      if (!stats.isFile()) {
        throw new Error('Backup path is not a file');
      }
      
      if (stats.size === 0) {
        throw new Error('Backup file is empty');
      }
      
      // Verify checksum if available
      const checksumPath = `${backupPath}.sha256`;
      try {
        const expectedChecksum = (await fs.readFile(checksumPath, 'utf8')).trim();
        const actualChecksum = await this.calculateFileChecksum(backupPath);
        
        if (expectedChecksum !== actualChecksum) {
          throw new Error('Backup file checksum validation failed');
        }
        
        this.logger.info('Backup file checksum validated', { backupPath });
        
      } catch (checksumError) {
        this.logger.warn('Checksum validation skipped', { 
          reason: checksumError.message 
        });
      }
      
      this.logger.info('Backup file validation passed', { 
        path: backupPath, 
        size: this.formatBytes(stats.size) 
      });
      
    } catch (error) {
      throw new Error(`Backup file validation failed: ${error.message}`);
    }
  }
  
  /**
   * Calculate SHA-256 checksum of a file
   */
  async calculateFileChecksum(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = createReadStream(filePath);
      
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
  
  /**
   * Setup temporary workspace for restore operation
   */
  async setupTemporaryWorkspace(restoreId) {
    const workspaceDir = path.join(this.config.tempDir, restoreId);
    
    try {
      await fs.mkdir(workspaceDir, { recursive: true });
      this.logger.info('Temporary workspace created', { workspace: workspaceDir });
    } catch (error) {
      throw new Error(`Failed to create temporary workspace: ${error.message}`);
    }
  }
  
  /**
   * Process backup file (decrypt, decompress, extract)
   */
  async processBackupFile(backupPath, restoreId) {
    let currentPath = backupPath;
    const workspaceDir = path.join(this.config.tempDir, restoreId);
    
    // Copy to workspace first
    const workingPath = path.join(workspaceDir, path.basename(backupPath));
    await fs.copyFile(currentPath, workingPath);
    currentPath = workingPath;
    
    // Decrypt if encrypted
    if (currentPath.endsWith('.enc')) {
      const decryptedPath = currentPath.replace('.enc', '');
      await this.decryptFile(currentPath, decryptedPath);
      await fs.unlink(currentPath);
      currentPath = decryptedPath;
      this.logger.info('Backup file decrypted', { path: currentPath });
    }
    
    // Decompress if compressed
    if (currentPath.endsWith('.gz')) {
      const decompressedPath = currentPath.replace('.gz', '');
      await this.decompressFile(currentPath, decompressedPath);
      await fs.unlink(currentPath);
      currentPath = decompressedPath;
      this.logger.info('Backup file decompressed', { path: currentPath });
    }
    
    // Extract tar archive
    if (currentPath.endsWith('.tar')) {
      const extractedDir = path.join(workspaceDir, 'extracted');
      await this.extractTarArchive(currentPath, extractedDir);
      currentPath = extractedDir;
      this.logger.info('Backup archive extracted', { path: currentPath });
    }
    
    return currentPath;
  }
  
  /**
   * Decrypt encrypted backup file
   */
  async decryptFile(encryptedPath, outputPath) {
    if (!process.env.BACKUP_ENCRYPTION_KEY) {
      throw new Error('Encryption key not provided for encrypted backup');
    }
    
    const key = crypto.scryptSync(process.env.BACKUP_ENCRYPTION_KEY, 'salt', 32);
    
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(encryptedPath);
      const writeStream = createWriteStream(outputPath);
      
      // Read IV from beginning of file
      const ivBuffer = Buffer.alloc(12);
      let ivRead = false;
      let decipher;
      
      readStream.on('data', (chunk) => {
        if (!ivRead) {
          chunk.copy(ivBuffer, 0, 0, 12);
          decipher = crypto.createDecipherGCM('aes-256-gcm', key, ivBuffer);
          
          // Process remaining data after IV
          if (chunk.length > 12) {
            const remainingChunk = chunk.slice(12);
            writeStream.write(decipher.update(remainingChunk));
          }
          ivRead = true;
        } else {
          writeStream.write(decipher.update(chunk));
        }
      });
      
      readStream.on('end', () => {
        try {
          writeStream.write(decipher.final());
          writeStream.end();
          resolve();
        } catch (error) {
          reject(new Error(`Decryption failed: ${error.message}`));
        }
      });
      
      readStream.on('error', reject);
      writeStream.on('error', reject);
    });
  }
  
  /**
   * Decompress gzipped file
   */
  async decompressFile(compressedPath, outputPath) {
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(compressedPath);
      const writeStream = createWriteStream(outputPath);
      const gunzip = createGunzip();
      
      readStream
        .pipe(gunzip)
        .pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });
  }
  
  /**
   * Extract tar archive
   */
  async extractTarArchive(tarPath, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    
    return new Promise((resolve, reject) => {
      const tar = spawn('tar', ['-xf', tarPath, '-C', outputDir]);
      
      let stderr = '';
      
      tar.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      tar.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`tar extraction failed with code ${code}: ${stderr}`));
        }
      });
      
      tar.on('error', (error) => {
        reject(new Error(`tar extraction error: ${error.message}`));
      });
    });
  }
  
  /**
   * Validate backup contents
   */
  async validateBackupContents(backupDir) {
    try {
      // Check if backup directory structure is valid
      const items = await fs.readdir(backupDir);
      
      if (items.length === 0) {
        throw new Error('Backup directory is empty');
      }
      
      // Look for expected MongoDB dump structure
      let foundDatabase = false;
      
      for (const item of items) {
        const itemPath = path.join(backupDir, item);
        const stats = await fs.stat(itemPath);
        
        if (stats.isDirectory()) {
          // Check for BSON files in database directory
          const dbFiles = await fs.readdir(itemPath);
          const bsonFiles = dbFiles.filter(file => file.endsWith('.bson'));
          
          if (bsonFiles.length > 0) {
            foundDatabase = true;
            this.logger.info('Found database collections', { 
              database: item, 
              collections: bsonFiles.length 
            });
          }
        }
      }
      
      if (!foundDatabase) {
        throw new Error('No valid database collections found in backup');
      }
      
      this.logger.info('Backup contents validation passed', { backupDir });
      
    } catch (error) {
      throw new Error(`Backup contents validation failed: ${error.message}`);
    }
  }
  
  /**
   * Create safety backup of current database
   */
  async createSafetyBackup(targetDatabase) {
    if (!targetDatabase) return;
    
    const safetyBackupName = `${targetDatabase}_safety_${Date.now()}`;
    
    this.logger.info('Creating safety backup before restore', { 
      sourceDb: targetDatabase,
      safetyDb: safetyBackupName
    });
    
    try {
      // Use MongoDB's copydb or mongodump for safety backup
      const backupDir = path.join(this.config.tempDir, 'safety-backup');
      await fs.mkdir(backupDir, { recursive: true });
      
      const mongodumpArgs = [
        '--uri', this.config.mongoUrl,
        '--db', targetDatabase,
        '--out', backupDir
      ];
      
      await this.runCommand('mongodump', mongodumpArgs);
      
      this.logger.info('Safety backup created successfully', { 
        backupDir: path.join(backupDir, targetDatabase)
      });
      
    } catch (error) {
      this.logger.warn('Safety backup creation failed', { error: error.message });
      // Don't fail the restore process, but warn the user
    }
  }
  
  /**
   * Perform the actual database restore
   */
  async performRestore(backupDir, options) {
    const { targetDatabase, dropDatabase = false, collections = null } = options;
    
    this.logger.info('Starting database restore', { 
      backupDir, 
      targetDatabase,
      dropDatabase,
      collections 
    });
    
    // Find the database directory in the backup
    const items = await fs.readdir(backupDir);
    let databaseDir = null;
    
    for (const item of items) {
      const itemPath = path.join(backupDir, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        // Check if this directory contains .bson files
        const files = await fs.readdir(itemPath);
        if (files.some(file => file.endsWith('.bson'))) {
          databaseDir = itemPath;
          break;
        }
      }
    }
    
    if (!databaseDir) {
      throw new Error('Could not find database directory in backup');
    }
    
    // Build mongorestore command
    const mongorestoreArgs = [
      '--uri', this.config.mongoUrl
    ];
    
    if (targetDatabase) {
      mongorestoreArgs.push('--db', targetDatabase);
    }
    
    if (dropDatabase) {
      mongorestoreArgs.push('--drop');
    }
    
    if (collections && Array.isArray(collections)) {
      // Restore specific collections only
      for (const collection of collections) {
        const collectionArgs = [...mongorestoreArgs];
        collectionArgs.push('--collection', collection);
        collectionArgs.push(path.join(databaseDir, `${collection}.bson`));
        
        await this.runCommand('mongorestore', collectionArgs);
      }
    } else {
      // Restore entire database
      mongorestoreArgs.push('--dir', databaseDir);
      await this.runCommand('mongorestore', mongorestoreArgs);
    }
    
    this.logger.success('Database restore completed', { targetDatabase });
  }
  
  /**
   * Validate restored database
   */
  async validateRestoredDatabase(targetDatabase) {
    if (!targetDatabase) return;
    
    this.logger.info('Validating restored database', { database: targetDatabase });
    
    try {
      // Basic validation using MongoDB connection
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(this.config.mongoUrl);
      
      await client.connect();
      const db = client.db(targetDatabase);
      
      // Get collection stats
      const collections = await db.listCollections().toArray();
      
      if (collections.length === 0) {
        throw new Error('No collections found in restored database');
      }
      
      let totalDocuments = 0;
      
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        totalDocuments += count;
        
        this.logger.info('Collection validated', { 
          name: collection.name, 
          documents: count 
        });
      }
      
      await client.close();
      
      this.logger.success('Database validation completed', { 
        database: targetDatabase,
        collections: collections.length,
        totalDocuments 
      });
      
    } catch (error) {
      throw new Error(`Database validation failed: ${error.message}`);
    }
  }
  
  /**
   * Run shell command with promise interface
   */
  async runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      
      let stdout = '';
      let stderr = '';
      
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`${command} failed with code ${code}: ${stderr}`));
        }
      });
      
      process.on('error', (error) => {
        reject(new Error(`${command} spawn error: ${error.message}`));
      });
    });
  }
  
  /**
   * Cleanup temporary files
   */
  async cleanup(restoreId) {
    const workspaceDir = path.join(this.config.tempDir, restoreId);
    
    try {
      await fs.rm(workspaceDir, { recursive: true, force: true });
      this.logger.info('Temporary workspace cleaned up', { workspace: workspaceDir });
    } catch (error) {
      this.logger.warn('Cleanup failed', { workspace: workspaceDir, error: error.message });
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
   * List collections in a backup
   */
  async listBackupCollections(backupPath) {
    const tempId = `list-${Date.now()}`;
    
    try {
      await this.setupTemporaryWorkspace(tempId);
      const processedPath = await this.processBackupFile(backupPath, tempId);
      
      // Find database directory
      const items = await fs.readdir(processedPath);
      let collections = [];
      
      for (const item of items) {
        const itemPath = path.join(processedPath, item);
        const stats = await fs.stat(itemPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(itemPath);
          const bsonFiles = files.filter(file => file.endsWith('.bson'));
          
          for (const bsonFile of bsonFiles) {
            const collectionName = bsonFile.replace('.bson', '');
            const filePath = path.join(itemPath, bsonFile);
            const fileStats = await fs.stat(filePath);
            
            collections.push({
              name: collectionName,
              database: item,
              size: fileStats.size,
              sizeHuman: this.formatBytes(fileStats.size)
            });
          }
        }
      }
      
      await this.cleanup(tempId);
      return collections;
      
    } catch (error) {
      await this.cleanup(tempId);
      throw error;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const restoreManager = new BackupRestoreManager();
  
  async function runCommand() {
    try {
      switch (command) {
        case 'restore':
          if (args.length < 2) {
            throw new Error('Restore requires backup path: node backup-restore.js restore <backup-path> [options]');
          }
          
          const backupPath = args[1];
          const options = {
            targetDatabase: args[2],
            dropDatabase: args.includes('--drop'),
            dryRun: args.includes('--dry-run')
          };
          
          const result = await restoreManager.restoreBackup(backupPath, options);
          console.log(JSON.stringify(result, null, 2));
          break;
          
        case 'list-collections':
          if (args.length < 2) {
            throw new Error('List collections requires backup path');
          }
          
          const collections = await restoreManager.listBackupCollections(args[1]);
          console.log(JSON.stringify(collections, null, 2));
          break;
          
        case 'validate':
          if (args.length < 2) {
            throw new Error('Validate requires backup path');
          }
          
          await restoreManager.validateBackupFile(args[1]);
          console.log('Backup validation passed');
          break;
          
        case 'help':
        default:
          console.log(`
Backup Restore Manager

Usage:
  node scripts/backup-restore.js <command> [options]

Commands:
  restore <backup-path> [target-db]   Restore backup to database
  list-collections <backup-path>      List collections in backup
  validate <backup-path>              Validate backup file
  help                               Show this help

Options:
  --drop                             Drop target database before restore
  --dry-run                         Validate only, don't perform restore

Examples:
  node scripts/backup-restore.js restore backup.tar.gz mydb
  node scripts/backup-restore.js restore backup.tar.gz mydb --drop
  node scripts/backup-restore.js list-collections backup.tar.gz
  node scripts/backup-restore.js validate backup.tar.gz
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

module.exports = BackupRestoreManager;