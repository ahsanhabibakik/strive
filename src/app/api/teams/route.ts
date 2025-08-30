import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { Team } from '@/lib/models/Team';
import { User } from '@/lib/models/User';
import { connectToDatabase } from '@/lib/database';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function GET(request: NextRequest) {
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

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build filter query - teams where user is owner or member
    const filter: any = {
      $or: [
        { ownerId: user._id },
        { 'members.userId': user._id }
      ]
    };
    
    if (search) {
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder;

    const [teams, total] = await Promise.all([
      Team.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('ownerId', 'name email avatar')
        .populate('members.userId', 'name email avatar')
        .lean(),
      Team.countDocuments(filter)
    ]);

    return NextResponse.json({
      teams,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 20 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: rateLimitResult.headers }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if team name already exists for this user
    const existingTeam = await Team.findOne({ 
      name: body.name, 
      ownerId: user._id 
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'A team with this name already exists' },
        { status: 400 }
      );
    }

    const teamData = {
      name: body.name.trim(),
      description: body.description?.trim() || '',
      ownerId: user._id,
      isPublic: body.isPublic || false,
      settings: {
        allowMemberInvites: body.settings?.allowMemberInvites ?? true,
        requireApprovalForJoining: body.settings?.requireApprovalForJoining ?? false,
        defaultMemberRole: body.settings?.defaultMemberRole || 'member'
      }
    };

    const team = new Team(teamData);
    await team.save();

    // Populate response data
    const populatedTeam = await Team.findById(team._id)
      .populate('ownerId', 'name email avatar')
      .lean();

    return NextResponse.json(
      { message: 'Team created successfully', team: populatedTeam },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating team:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}