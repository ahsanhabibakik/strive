#!/usr/bin/env node

/**
 * Database Reset Script
 * Completely resets the database - USE WITH CAUTION!
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

// Confirm reset in production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Database reset is not allowed in production environment');
  process.exit(1);
}

async function resetDatabase() {
  console.log('🔥 Starting database reset...');
  console.log('⚠️  This will delete ALL data in the database!');
  
  // Get confirmation
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve, reject) => {
    rl.question('Are you sure you want to continue? (yes/no): ', async (answer) => {
      rl.close();
      
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Database reset cancelled');
        process.exit(0);
      }
      
      const client = new MongoClient(MONGODB_URI);
      
      try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db();
        
        // Get all collections
        const collections = await db.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections`);
        
        // Drop all collections
        for (const collection of collections) {
          await db.collection(collection.name).drop();
          console.log(`   🗑️  Dropped collection: ${collection.name}`);
        }
        
        console.log('✅ All collections dropped');
        
        // Re-run setup
        console.log('🔄 Re-running database setup...');
        const setupScript = require('./db-setup.js');
        
        console.log('🎉 Database reset completed successfully!');
        console.log('💡 You may want to run "npm run db:seed" to add sample data');
        
        resolve();
        
      } catch (error) {
        console.error('❌ Database reset failed:', error);
        reject(error);
      } finally {
        await client.close();
      }
    });
  });
}

// Run reset if called directly
if (require.main === module) {
  resetDatabase().catch(error => {
    console.error(error);
    process.exit(1);
  });
}