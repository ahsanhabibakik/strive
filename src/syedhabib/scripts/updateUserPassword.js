require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function updateUserPassword() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env.local');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('ebrikkho_next_db');
    const users = db.collection('users');

    // Find the user
    const user = await users.findOne({ email: 'syedmirhabib@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    // Hash the password
    const password = 'SuperHabibadmin1@';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user
    const result = await users.updateOne(
      { email: 'ahabibakik@gmail.com' },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    console.log('User updated:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateUserPassword(); 