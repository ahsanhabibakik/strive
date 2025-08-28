const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function createUser() {
  const email = 'user@example.com';
  const password = 'password123';
  const name = 'Regular User';
  
  try {
    // Get MongoDB URI from environment variable
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://syedmirhabib:cPPWJXgrus9Fkc0O@syedhabib.0pkxuzn.mongodb.net/ebrikkho_next_db?retryWrites=true&w=majority&appName=syedhabib';
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Connect to MongoDB
    const client = new MongoClient(mongoUri);
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
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      role: 'user',
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('User created successfully:', result.insertedId);
    console.log('Login credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    
    await client.close();
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createUser(); 