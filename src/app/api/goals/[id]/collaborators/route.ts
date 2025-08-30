import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { Goal } from '@/lib/models/Goal';
import { User } from '@/lib/models/User';
import { connectToDatabase } from '@/lib/database';
import { rateLimit } from '@/lib/utils/rate-limit';
import { isValidObjectId } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 100 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const goal = await Goal.findById(params.id)
      .populate('collaborators.userId', 'name email avatar')
      .populate('userId', 'name email avatar')
      .lean();

    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Check access permissions
    const isOwner = goal.userId._id.toString() === user._id.toString();
    const isCollaborator = goal.collaborators.some(c => 
      c.userId._id.toString() === user._id.toString()
    );

    if (!isOwner && !isCollaborator && !goal.isPublic) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({
      owner: goal.userId,
      collaborators: goal.collaborators
    });

  } catch (error) {
    console.error('Error fetching collaborators:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 30 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Only owner can add collaborators
    if (goal.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Only goal owner can add collaborators' }, { status: 403 });
    }

    const body = await request.json();
    const { email, role = 'viewer' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!['viewer', 'contributor', 'editor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Find user to invite
    const collaboratorUser = await User.findOne({ email });
    if (!collaboratorUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already a collaborator
    const existingCollaborator = goal.collaborators.find(c => 
      c.userId.toString() === collaboratorUser._id.toString()
    );

    if (existingCollaborator) {
      return NextResponse.json({ error: 'User is already a collaborator' }, { status: 400 });
    }

    // Check if trying to add self
    if (collaboratorUser._id.toString() === user._id.toString()) {
      return NextResponse.json({ error: 'Cannot add yourself as collaborator' }, { status: 400 });
    }

    // Add collaborator
    goal.collaborators.push({
      userId: collaboratorUser._id,
      role,
      addedAt: new Date()
    });

    await goal.save();

    // Populate the response
    const updatedGoal = await Goal.findById(params.id)
      .populate('collaborators.userId', 'name email avatar')
      .lean();

    return NextResponse.json({
      message: 'Collaborator added successfully',
      collaborator: updatedGoal.collaborators.find(c => 
        c.userId._id.toString() === collaboratorUser._id.toString()
      )
    });

  } catch (error) {
    console.error('Error adding collaborator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 30 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Only owner can update collaborator roles
    if (goal.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Only goal owner can update collaborator roles' }, { status: 403 });
    }

    const body = await request.json();
    const { collaboratorId, role } = body;

    if (!collaboratorId || !role) {
      return NextResponse.json({ error: 'Collaborator ID and role are required' }, { status: 400 });
    }

    if (!['viewer', 'contributor', 'editor'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Find and update collaborator
    const collaboratorIndex = goal.collaborators.findIndex(c => 
      c.userId.toString() === collaboratorId
    );

    if (collaboratorIndex === -1) {
      return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
    }

    goal.collaborators[collaboratorIndex].role = role;
    await goal.save();

    // Populate the response
    const updatedGoal = await Goal.findById(params.id)
      .populate('collaborators.userId', 'name email avatar')
      .lean();

    return NextResponse.json({
      message: 'Collaborator role updated successfully',
      collaborator: updatedGoal.collaborators[collaboratorIndex]
    });

  } catch (error) {
    console.error('Error updating collaborator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 30 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const collaboratorId = url.searchParams.get('collaboratorId');

    if (!collaboratorId) {
      return NextResponse.json({ error: 'Collaborator ID is required' }, { status: 400 });
    }

    // Check permissions - owner can remove any collaborator, collaborator can remove themselves
    const isOwner = goal.userId.toString() === user._id.toString();
    const isSelfRemoval = collaboratorId === user._id.toString();

    if (!isOwner && !isSelfRemoval) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Find collaborator
    const collaboratorIndex = goal.collaborators.findIndex(c => 
      c.userId.toString() === collaboratorId
    );

    if (collaboratorIndex === -1) {
      return NextResponse.json({ error: 'Collaborator not found' }, { status: 404 });
    }

    // Remove collaborator
    goal.collaborators.splice(collaboratorIndex, 1);
    await goal.save();

    return NextResponse.json({ 
      message: isSelfRemoval ? 'Left goal successfully' : 'Collaborator removed successfully' 
    });

  } catch (error) {
    console.error('Error removing collaborator:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}