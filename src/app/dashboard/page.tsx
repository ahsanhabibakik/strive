import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { RBAC } from '@/lib/rbac';

export const metadata = {
  title: 'Dashboard - Strive',
  description: 'Overview of your application metrics and activities',
};

async function getDashboardData(user: any) {
  await connectToDatabase();
  
  const stats = {
    totalUsers: await User.countDocuments({ isActive: true }),
    totalAdmins: await User.countDocuments({ role: 'admin', isActive: true }),
    totalModerators: await User.countDocuments({ role: 'moderator', isActive: true }),
    activeSubscriptions: await User.countDocuments({ 
      'subscription.status': 'active',
      isActive: true 
    }),
  };

  return { stats };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    return null;
  }

  const { stats } = await getDashboardData(user);
  const userRole = RBAC.getUserRole(user);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeCard user={user} />

      {/* Stats Grid */}
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
        <DashboardStats stats={stats} user={user} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions user={user} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
            <RecentActivity user={user} />
          </Suspense>
        </div>
      </div>

      {/* System Health */}
      {RBAC.hasPermission(user, 'system:admin') && (
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg" />}>
          <SystemHealth />
        </Suspense>
      )}
    </div>
  );
}