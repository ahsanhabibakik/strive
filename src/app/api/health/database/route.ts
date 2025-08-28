import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        connected: false,
        details: 'MONGODB_URI not configured',
      });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    // Test basic operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    // Test read/write operations
    const testCollection = db.collection('_health_check');
    const testDoc = { timestamp: new Date(), test: true };
    const insertResult = await testCollection.insertOne(testDoc);
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    
    await client.close();

    return NextResponse.json({
      connected: true,
      details: `Connected with ${collections.length} collections`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        details: `Connection failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}