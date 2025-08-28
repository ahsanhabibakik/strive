const { hash } = require('bcryptjs');
const { MongoClient } = require('mongodb');
const { env } = require('../src/lib/env');

async function createAdminUser() {
  const email = 'syedmirhabib@gmail.com';
  const password = 'SuperHabibadmin1@';
  
  try {
    // Connect to MongoDB
    if (!env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      console.log('User already exists:', existingUser);
      await client.close();
      return;
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 12);
    
    // Create new user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name: 'Syed Mir Habib',
      role: 'admin',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('Admin user created successfully:', result.insertedId);
    
    await client.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
