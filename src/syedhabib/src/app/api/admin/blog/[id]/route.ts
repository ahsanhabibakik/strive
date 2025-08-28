import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { BlogPost } from '@/types/blog';

function getObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const _id = getObjectId(id);
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const client = await clientPromise;
    const post = await client.db().collection<BlogPost>('blogposts').findOne({ _id });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    console.error('Error fetching post', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const _id = getObjectId(id);
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const body = await req.json();
    const client = await clientPromise;
    await client.db().collection('blogposts').updateOne({ _id }, { $set: body });
    await client.db().collection('activities').insertOne({
      action: 'Updated blog post',
      timestamp: new Date().toISOString(),
      meta: { postId: _id }
    });
    const updated = await client.db().collection<BlogPost>('blogposts').findOne({ _id });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating post', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const _id = getObjectId(id);
  if (!_id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const client = await clientPromise;
    await client.db().collection('blogposts').deleteOne({ _id });
    await client.db().collection('activities').insertOne({
      action: 'Deleted blog post',
      timestamp: new Date().toISOString(),
      meta: { postId: _id }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting post', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}