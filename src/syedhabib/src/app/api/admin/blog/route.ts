import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { OptionalId } from 'mongodb';
import { BlogPost } from '@/types/blog';

// GET /api/admin/blog  -> list blog posts
export async function GET() {
  try {
    const client = await clientPromise;
    const posts = await client.db().collection<BlogPost>('blogposts').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(posts);
  } catch (err) {
    console.error('Error fetching blog posts', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST /api/admin/blog  -> create blog post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await clientPromise;

    const now = new Date();
    const doc: Omit<BlogPost, '_id'> = {
      ...body,
      date: body.date || now.toISOString(),
    };

    const result = await client.db().collection('blogposts').insertOne(doc as OptionalId<BlogPost>);

    // Log activity
    await client.db().collection('activities').insertOne({
      action: 'Created blog post',
      timestamp: new Date().toISOString(),
      meta: { postId: result.insertedId, title: doc.title }
    });

    return NextResponse.json({ _id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('Error creating blog post', err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}