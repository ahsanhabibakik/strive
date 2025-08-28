import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Activity } from '@/types/activity';

function oid(id: string) {
  try { return new ObjectId(id);} catch { return null; }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const objectId = oid(id);
  if (!objectId) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  try {
    const client = await clientPromise;
    const act = await client.db().collection<Activity>('activities').findOne({ _id: objectId });
    if (!act) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(act);
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const objectId = oid(id);
  if (!objectId) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  try {
    const client = await clientPromise;
    await client.db().collection('activities').deleteOne({ _id: objectId });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}