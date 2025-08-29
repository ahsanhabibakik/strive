import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/config';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!RBAC.hasPermission(user, 'api-keys:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get user's current plan
    const currentPlan = user.subscription?.plan || 'free';
    const planData = SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS];
    
    // Extract monthly limit from plan features (this is a simplified approach)
    const monthlyLimit = currentPlan === 'free' ? 1000 : 
                        currentPlan === 'pro' ? 50000 : 
                        -1; // unlimited for enterprise

    // Mock usage data - In a real app, this would come from a usage tracking system
    const mockCurrentRequests = Math.floor(Math.random() * monthlyLimit * 0.7); // 0-70% of limit
    const mockRateLimit = currentPlan === 'free' ? 100 : 
                         currentPlan === 'pro' ? 1000 : 
                         5000; // requests per minute

    // Generate mock daily usage for the last 7 days
    const dailyUsage = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      return {
        date: date.toISOString(),
        requests: Math.floor(Math.random() * (mockCurrentRequests / 7))
      };
    });

    const usageData = {
      current: {
        requests: mockCurrentRequests,
        limit: monthlyLimit === -1 ? 999999 : monthlyLimit,
        percentage: monthlyLimit === -1 ? 0 : (mockCurrentRequests / monthlyLimit) * 100
      },
      daily: dailyUsage,
      rateLimit: {
        remaining: Math.floor(Math.random() * mockRateLimit),
        limit: mockRateLimit,
        resetTime: new Date(Date.now() + 60000).toISOString() // Reset in 1 minute
      },
      plan: {
        name: planData.name,
        monthlyLimit: monthlyLimit === -1 ? 'Unlimited' : monthlyLimit,
        rateLimit: mockRateLimit
      }
    };

    return NextResponse.json(usageData);

  } catch (error) {
    console.error('Error fetching API usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API usage' },
      { status: 500 }
    );
  }
}