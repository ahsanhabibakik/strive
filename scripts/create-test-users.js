const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://edibleUser:1sQi0efO3AWcAUsb@edibleworld.ygxajlw.mongodb.net/strive-test?retryWrites=true&w=majority&appName=edibleworld';

async function createTestUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('strive-test');
    const users = db.collection('users');
    
    // Clear existing users
    await users.deleteMany({});
    console.log('🧹 Cleared existing users');
    
    // Hash password for test users
    const hashedPassword = await bcrypt.hash('testpassword123', 12);
    
    const testUsers = [
      {
        name: 'Super Admin',
        email: 'admin@strive.test',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        subscription: {
          plan: 'enterprise',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      },
      {
        name: 'John Moderator',
        email: 'moderator@strive.test',
        password: hashedPassword,
        role: 'moderator',
        isActive: true,
        isEmailVerified: true,
        subscription: {
          plan: 'pro',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        name: 'Jane User',
        email: 'user@strive.test',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isEmailVerified: true,
        subscription: {
          plan: 'basic',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        name: 'Free User',
        email: 'free@strive.test',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isEmailVerified: true,
        subscription: {
          plan: 'free',
          status: 'active',
          startDate: new Date(),
          endDate: null
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      },
      {
        name: 'Test Manager',
        email: 'manager@strive.test',
        password: hashedPassword,
        role: 'manager',
        isActive: true,
        isEmailVerified: true,
        subscription: {
          plan: 'pro',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];
    
    const result = await users.insertMany(testUsers);
    console.log(`✅ Created ${result.insertedCount} test users`);
    
    console.log('\n🔑 Test User Credentials:');
    console.log('==========================================');
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / testpassword123`);
    });
    console.log('==========================================\n');
    
    console.log('✅ Test users created successfully!');
    console.log('🌐 You can now test the dashboard at: http://localhost:3002');
    console.log('🔐 Sign in with any of the test credentials above');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await client.close();
  }
}

createTestUsers();