#!/usr/bin/env node

/**
 * Database Seeding Script
 * Seeds the database with sample data for development
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

// Sample data
const sampleNewsletterSubscribers = [
  { email: 'john@example.com', subscribedAt: new Date(), status: 'active' },
  { email: 'jane@example.com', subscribedAt: new Date(), status: 'active' },
  { email: 'bob@example.com', subscribedAt: new Date(), status: 'active' },
];

const sampleAnalyticsEvents = [
  {
    eventType: 'page_view',
    page: '/',
    userId: null,
    sessionId: 'session_1',
    timestamp: new Date(),
    data: { referrer: 'direct' }
  },
  {
    eventType: 'newsletter_subscribe',
    page: '/',
    userId: null,
    sessionId: 'session_2',
    timestamp: new Date(),
    data: { email: 'john@example.com' }
  },
  {
    eventType: 'button_click',
    page: '/',
    userId: null,
    sessionId: 'session_3',
    timestamp: new Date(),
    data: { button: 'get_started' }
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // Seed newsletter subscribers
    console.log('📧 Seeding newsletter subscribers...');
    const newsletterCollection = db.collection('newsletter_subscribers');
    
    // Clear existing data first
    await newsletterCollection.deleteMany({});
    
    const newsletterResult = await newsletterCollection.insertMany(sampleNewsletterSubscribers);
    console.log(`   ✅ Inserted ${newsletterResult.insertedCount} newsletter subscribers`);
    
    // Seed analytics events
    console.log('📊 Seeding analytics events...');
    const analyticsCollection = db.collection('analytics_events');
    
    // Clear existing data first
    await analyticsCollection.deleteMany({});
    
    const analyticsResult = await analyticsCollection.insertMany(sampleAnalyticsEvents);
    console.log(`   ✅ Inserted ${analyticsResult.insertedCount} analytics events`);
    
    // Generate more analytics events for the last 30 days
    console.log('📈 Generating historical analytics data...');
    const historicalEvents = [];
    const eventTypes = ['page_view', 'button_click', 'newsletter_subscribe', 'form_submit'];
    const pages = ['/', '/blog', '/about', '/contact'];
    
    for (let i = 0; i < 1000; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      
      historicalEvents.push({
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        userId: Math.random() > 0.7 ? `user_${Math.floor(Math.random() * 100)}` : null,
        sessionId: `session_${Math.floor(Math.random() * 1000)}`,
        timestamp: timestamp,
        data: {
          userAgent: 'Mozilla/5.0 (compatible; SeedBot/1.0)',
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        }
      });
    }
    
    const historicalResult = await analyticsCollection.insertMany(historicalEvents);
    console.log(`   ✅ Inserted ${historicalResult.insertedCount} historical analytics events`);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Newsletter subscribers: ${newsletterResult.insertedCount}`);
    console.log(`   Analytics events: ${analyticsResult.insertedCount + historicalResult.insertedCount}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run seeding
seedDatabase();