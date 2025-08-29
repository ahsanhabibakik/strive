import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SystemSettings } from '@/components/settings/SystemSettings';

export const metadata = {
  title: 'Settings - Strive',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user has settings access
  if (!RBAC.hasPermission(user, 'settings:read')) {
    redirect('/dashboard');
  }

  const canWriteSettings = RBAC.hasPermission(user, 'settings:write');
  const isSystemAdmin = RBAC.hasPermission(user, 'system:admin');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings, security preferences, and system configuration
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="space-y-8">
          <ProfileSettings 
            user={user} 
            canEdit={true} 
          />
          
          <SecuritySettings 
            user={user}
            canEdit={true}
          />
        </div>

        {/* System Settings */}
        <div className="space-y-8">
          <NotificationSettings 
            user={user}
            canEdit={true}
          />
          
          {isSystemAdmin && (
            <SystemSettings 
              canEdit={canWriteSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
}