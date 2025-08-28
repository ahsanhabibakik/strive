const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function updateAdminUser() {
  const email = 'mirakik.habib@gmail.com';
  
  try {
    // Get MongoDB URI from environment variable
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Connect to MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db();
    
    // Update user role to admin
    const result = await db.collection('users').updateOne(
      { email },
      {
        $set: {
          role: 'admin',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      console.log('User not found:', email);
    } else {
      console.log('User updated successfully:', email);
    }
    
    await client.close();
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
}

updateAdminUser(); 