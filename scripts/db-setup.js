#!/usr/bin/env node

/**
 * Database Setup Script
 * Sets up MongoDB collections, indexes, and initial data
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

const collections = [
  {
    name: 'users',
    indexes: [
      { key: { email: 1 }, options: { unique: true } },
      { key: { createdAt: -1 } },
      { key: { lastLoginAt: -1 } },
    ],
  },
  {
    name: 'newsletter_subscribers',
    indexes: [
      { key: { email: 1 }, options: { unique: true } },
      { key: { subscribedAt: -1 } },
      { key: { status: 1 } },
    ],
  },
  {
    name: 'sessions',
    indexes: [
      { key: { expires: 1 }, options: { expireAfterSeconds: 0 } },
      { key: { sessionToken: 1 }, options: { unique: true } },
    ],
  },
  {
    name: 'accounts',
    indexes: [
      { key: { userId: 1 } },
      { key: { provider: 1, providerAccountId: 1 }, options: { unique: true } },
    ],
  },
  {
    name: 'verification_tokens',
    indexes: [
      { key: { expires: 1 }, options: { expireAfterSeconds: 0 } },
      { key: { token: 1 }, options: { unique: true } },
    ],
  },
  {
    name: 'analytics_events',
    indexes: [
      { key: { timestamp: -1 } },
      { key: { userId: 1, timestamp: -1 } },
      { key: { eventType: 1, timestamp: -1 } },
      { key: { sessionId: 1 } },
      // TTL index to auto-delete old analytics data (90 days)
      { key: { timestamp: 1 }, options: { expireAfterSeconds: 7776000 } },
    ],
  },
];

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Create collections and indexes
    for (const collection of collections) {
      console.log(`📦 Setting up collection: ${collection.name}`);
      
      // Create collection if it doesn't exist
      const collectionExists = await db.listCollections({ name: collection.name }).hasNext();
      if (!collectionExists) {
        await db.createCollection(collection.name);
        console.log(`   ✅ Created collection: ${collection.name}`);
      } else {
        console.log(`   ℹ️  Collection ${collection.name} already exists`);
      }
      
      // Create indexes
      const coll = db.collection(collection.name);
      for (const index of collection.indexes) {
        try {
          await coll.createIndex(index.key, index.options || {});
          const indexName = Object.keys(index.key).join('_');
          console.log(`   ✅ Created index: ${indexName}`);
        } catch (error) {
          if (error.code === 85) {
            // Index already exists
            console.log(`   ℹ️  Index already exists: ${Object.keys(index.key).join('_')}`);
          } else {
            throw error;
          }
        }
      }
    }
    
    // Create initial admin user if needed
    const usersCollection = db.collection('users');
    const adminExists = await usersCollection.findOne({ email: 'admin@strive.local' });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await usersCollection.insertOne({
        name: 'Admin User',
        email: 'admin@strive.local',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        emailVerified: new Date(),
      });
      
      console.log('✅ Created admin user (admin@strive.local / admin123)');
    }
    
    // Verify setup
    console.log('\n📊 Database Statistics:');
    const stats = await db.admin().serverStatus();
    console.log(`   Version: MongoDB ${stats.version}`);
    console.log(`   Uptime: ${Math.floor(stats.uptime / 3600)} hours`);
    
    const collections_stats = await db.listCollections().toArray();
    console.log(`   Collections: ${collections_stats.length}`);
    
    console.log('\n🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run setup
setupDatabase();