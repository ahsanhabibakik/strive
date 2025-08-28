import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Activity } from '@/types/activity';
import { OptionalId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const activities = await client.db().collection<Activity>('activities').find({}).sort({ timestamp: -1 }).limit(100).toArray();
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const doc: Omit<Activity, '_id'> = { ...body, timestamp: body.timestamp || new Date().toISOString() };
    const res = await client.db().collection('activities').insertOne(doc as OptionalId<Activity>);
    return NextResponse.json({ _id: res.insertedId.toString(), ...doc });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}