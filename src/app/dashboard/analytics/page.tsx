import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { UserGrowthChart } from '@/components/analytics/UserGrowthChart';
import { TopMetrics } from '@/components/analytics/TopMetrics';
import { ActivityFeed } from '@/components/analytics/ActivityFeed';

export const metadata = {
  title: 'Analytics - Strive',
  description: 'Analytics and metrics dashboard for your application',
};

async function getAnalyticsData(user: any) {
  await connectToDatabase();
  
  // Get user statistics
  const totalUsers = await User.countDocuments({ isActive: true });
  const newUsersThisMonth = await User.countDocuments({
    isActive: true,
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });
  
  const usersByPlan = await User.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$subscription.plan', count: { $sum: 1 } } }
  ]);

  const activeSubscriptions = await User.countDocuments({
    'subscription.status': 'active',
    isActive: true
  });

  // Calculate revenue (mock data for now)
  const monthlyRevenue = usersByPlan.reduce((acc: number, plan: any) => {
    const planPricing: Record<string, number> = { free: 0, pro: 29, enterprise: 99 };
    return acc + (plan.count * (planPricing[plan._id] || 0));
  }, 0);

  // User growth data (last 6 months)
  const userGrowthData = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 6 }
  ]);

  return {
    overview: {
      totalUsers,
      newUsersThisMonth,
      activeSubscriptions,
      monthlyRevenue,
    },
    usersByPlan: usersByPlan.reduce((acc: any, plan: any) => {
      acc[plan._id] = plan.count;
      return acc;
    }, {}),
    userGrowthData: userGrowthData.map((item: any) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      users: item.count
    })),
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user has analytics permissions
  if (!RBAC.hasPermission(user, 'analytics:read')) {
    redirect('/dashboard');
  }

  const analyticsData = await getAnalyticsData(user);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your application's performance and user engagement
        </p>
      </div>

      {/* Top Metrics */}
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
        <TopMetrics data={analyticsData.overview} />
      </Suspense>

      {/* Analytics Overview */}
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
        <AnalyticsOverview data={analyticsData} />
      </Suspense>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg" />}>
          <RevenueChart monthlyRevenue={analyticsData.overview.monthlyRevenue} />
        </Suspense>

        {/* User Growth Chart */}
        <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg" />}>
          <UserGrowthChart data={analyticsData.userGrowthData} />
        </Suspense>
      </div>

      {/* Activity Feed */}
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
        <ActivityFeed />
      </Suspense>
    </div>
  );
}