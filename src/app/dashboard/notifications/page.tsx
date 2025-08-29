import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { NotificationStats } from '@/components/notifications/NotificationStats';

export const metadata = {
  title: 'Notifications - Strive',
  description: 'Manage your notifications and alerts',
};

async function getNotifications(_userId: string) {
  // Mock notifications - In a real app, this would come from a database
  return [
    {
      id: '1',
      type: 'billing',
      title: 'Payment Successful',
      message: 'Your Pro subscription has been renewed for $29.00',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      data: {
        amount: 2900,
        planName: 'Pro'
      }
    },
    {
      id: '2',
      type: 'security',
      title: 'New Login Detected',
      message: 'Someone signed into your account from a new device',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      data: {
        device: 'Chrome on Windows',
        location: 'New York, NY'
      }
    },
    {
      id: '3',
      type: 'system',
      title: 'API Usage Warning',
      message: 'You have used 85% of your monthly API quota',
      read: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      data: {
        usage: 85,
        limit: 50000
      }
    },
    {
      id: '4',
      type: 'feature',
      title: 'New Feature Available',
      message: 'Advanced analytics dashboard is now available for Pro users',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      data: {
        feature: 'Advanced Analytics'
      }
    },
    {
      id: '5',
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for tomorrow at 2:00 AM UTC',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      data: {
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];
}

async function getNotificationStats(_userId: string) {
  return {
    total: 24,
    unread: 2,
    categories: {
      billing: 5,
      security: 3,
      system: 8,
      feature: 4,
      maintenance: 4
    },
    weekly: [
      { date: '2025-08-22', count: 2 },
      { date: '2025-08-23', count: 1 },
      { date: '2025-08-24', count: 4 },
      { date: '2025-08-25', count: 0 },
      { date: '2025-08-26', count: 3 },
      { date: '2025-08-27', count: 1 },
      { date: '2025-08-28', count: 2 }
    ]
  };
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    redirect('/auth/signin');
  }

  const [notifications, stats] = await Promise.all([
    getNotifications(user._id),
    getNotificationStats(user._id)
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          Stay updated with the latest activity and important updates
        </p>
      </div>

      {/* Notification Stats */}
      <NotificationStats stats={stats} />

      {/* Notification Center */}
      <NotificationCenter notifications={notifications} userId={user._id} />
    </div>
  );
}