import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import { APIKeyManager } from '@/components/api-keys/APIKeyManager';
import { APIKeyUsage } from '@/components/api-keys/APIKeyUsage';

export const metadata = {
  title: 'API Keys - Strive',
  description: 'Manage your API keys and monitor usage',
};

export default async function APIKeysPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Check if user has API keys access
  if (!RBAC.hasPermission(user, 'api-keys:read')) {
    redirect('/dashboard');
  }

  const canWrite = RBAC.hasPermission(user, 'api-keys:write');
  const canDelete = RBAC.hasPermission(user, 'api-keys:delete');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
        <p className="text-gray-600 mt-2">
          Manage your API keys to authenticate requests to our services
        </p>
      </div>

      {/* API Key Management */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <APIKeyManager 
            userId={user._id} 
            canCreate={canWrite}
            canDelete={canDelete}
          />
        </div>
        
        <div>
          <APIKeyUsage userId={user._id} />
        </div>
      </div>
    </div>
  );
}