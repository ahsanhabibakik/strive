import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { Progress } from '@/lib/models/Progress';
import { Goal } from '@/lib/models/Goal';
import { User } from '@/lib/models/User';
import { connectToDatabase } from '@/lib/database';
import { rateLimit } from '@/lib/utils/rate-limit';
import { isValidObjectId } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, { rpm: 50 });
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
    const goalId = url.searchParams.get('goalId');
    const period = parseInt(url.searchParams.get('period') || '30'); // days
    const type = url.searchParams.get('type'); // 'summary' | 'trends' | 'mood' | 'all'

    if (goalId && !isValidObjectId(goalId)) {
      return NextResponse.json({ error: 'Invalid goal ID' }, { status: 400 });
    }

    const since = new Date();
    since.setDate(since.getDate() - period);

    const baseFilter: any = { userId: user._id };
    if (goalId) baseFilter.goalId = goalId;

    const analytics: any = {};

    // Summary analytics
    if (!type || type === 'summary' || type === 'all') {
      const summaryPipeline = [
        { $match: { ...baseFilter, dateRecorded: { $gte: since } } },
        {
          $group: {
            _id: goalId ? '$goalId' : null,
            totalEntries: { $sum: 1 },
            totalTimeSpent: { $sum: '$timeSpent' },
            averageDifficulty: { $avg: '$difficulty' },
            averageConfidence: { $avg: '$confidence' },
            averageMotivation: { $avg: '$motivation' },
            improvementEntries: {
              $sum: { $cond: [{ $gt: ['$changeAmount', 0] }, 1, 0] }
            },
            neutralEntries: {
              $sum: { $cond: [{ $eq: ['$changeAmount', 0] }, 1, 0] }
            },
            setbackEntries: {
              $sum: { $cond: [{ $lt: ['$changeAmount', 0] }, 1, 0] }
            },
            totalProgress: { $sum: '$changeAmount' },
            averageProgress: { $avg: '$currentValue' }
          }
        }
      ];

      const [summaryResult] = await Progress.aggregate(summaryPipeline);
      analytics.summary = summaryResult || {
        totalEntries: 0,
        totalTimeSpent: 0,
        averageDifficulty: 0,
        averageConfidence: 0,
        averageMotivation: 0,
        improvementEntries: 0,
        neutralEntries: 0,
        setbackEntries: 0,
        totalProgress: 0,
        averageProgress: 0
      };
    }

    // Progress trends over time
    if (!type || type === 'trends' || type === 'all') {
      const trendsPipeline = [
        { $match: { ...baseFilter, dateRecorded: { $gte: since } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$dateRecorded'
              }
            },
            entries: { $sum: 1 },
            averageProgress: { $avg: '$currentValue' },
            averageDifficulty: { $avg: '$difficulty' },
            averageConfidence: { $avg: '$confidence' },
            averageMotivation: { $avg: '$motivation' },
            totalTimeSpent: { $sum: '$timeSpent' },
            improvements: {
              $sum: { $cond: [{ $gt: ['$changeAmount', 0] }, 1, 0] }
            },
            setbacks: {
              $sum: { $cond: [{ $lt: ['$changeAmount', 0] }, 1, 0] }
            }
          }
        },
        { $sort: { '_id': 1 } }
      ];

      analytics.trends = await Progress.aggregate(trendsPipeline);
    }

    // Mood analysis
    if (!type || type === 'mood' || type === 'all') {
      const moodPipeline = [
        { $match: { ...baseFilter, dateRecorded: { $gte: since } } },
        {
          $group: {
            _id: '$mood',
            count: { $sum: 1 },
            averageProgress: { $avg: '$currentValue' },
            averageConfidence: { $avg: '$confidence' },
            averageMotivation: { $avg: '$motivation' }
          }
        },
        { $sort: { count: -1 } }
      ];

      analytics.mood = await Progress.aggregate(moodPipeline);

      // Mood trends over time
      const moodTrendsPipeline = [
        { $match: { ...baseFilter, dateRecorded: { $gte: since } } },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$dateRecorded'
                }
              },
              mood: '$mood'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ];

      analytics.moodTrends = await Progress.aggregate(moodTrendsPipeline);
    }

    // Goal-specific analytics if goalId provided
    if (goalId) {
      const goal = await Goal.findById(goalId).select('title measurable timeBound');
      if (!goal) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
      }

      // Check access permissions
      const hasAccess = 
        goal.userId.toString() === user._id.toString() ||
        goal.collaborators.some(c => c.userId.toString() === user._id.toString());

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Progress towards target
      const progressToTarget = {
        current: goal.measurable.currentValue,
        target: goal.measurable.targetValue,
        percentage: Math.min(Math.round((goal.measurable.currentValue / goal.measurable.targetValue) * 100), 100),
        remaining: Math.max(goal.measurable.targetValue - goal.measurable.currentValue, 0),
        unit: goal.measurable.unit
      };

      // Time analysis
      const now = new Date();
      const startDate = new Date(goal.timeBound.startDate);
      const endDate = new Date(goal.timeBound.endDate);
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), 0);

      const timeAnalysis = {
        totalDays,
        daysPassed: Math.max(daysPassed, 0),
        daysRemaining,
        percentageTimeElapsed: Math.min(Math.round((daysPassed / totalDays) * 100), 100),
        isOnTrack: progressToTarget.percentage >= Math.round((daysPassed / totalDays) * 100),
        isOverdue: now > endDate && progressToTarget.percentage < 100
      };

      analytics.goalSpecific = {
        goal: {
          id: goal._id,
          title: goal.title
        },
        progressToTarget,
        timeAnalysis
      };
    }

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Error fetching progress analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}