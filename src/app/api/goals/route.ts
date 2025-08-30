import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Goal } from '@/lib/models/Goal';
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
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build filter query
    const filter: any = { userId: user._id };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { specific: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder;

    const [goals, total] = await Promise.all([
      Goal.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('collaborators.userId', 'name email avatar')
        .lean(),
      Goal.countDocuments(filter)
    ]);

    return NextResponse.json({
      goals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching goals:', error);
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
    const rateLimitResult = await rateLimit(request, { rpm: 30 });
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
    const requiredFields = ['title', 'specific', 'measurable', 'relevant', 'timeBound'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate measurable object
    if (!body.measurable.metric || !body.measurable.targetValue || !body.measurable.unit) {
      return NextResponse.json(
        { error: 'Measurable field must include metric, targetValue, and unit' },
        { status: 400 }
      );
    }

    // Validate time bound object
    if (!body.timeBound.startDate || !body.timeBound.endDate) {
      return NextResponse.json(
        { error: 'TimeBound field must include startDate and endDate' },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(body.timeBound.startDate);
    const endDate = new Date(body.timeBound.endDate);
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const goalData = {
      ...body,
      userId: user._id,
      measurable: {
        ...body.measurable,
        currentValue: body.measurable.currentValue || 0
      },
      timeBound: {
        ...body.timeBound,
        startDate,
        endDate,
        milestones: body.timeBound.milestones || []
      }
    };

    const goal = new Goal(goalData);
    await goal.save();

    return NextResponse.json(
      { message: 'Goal created successfully', goal },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating goal:', error);
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