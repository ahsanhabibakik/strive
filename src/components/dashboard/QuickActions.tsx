import Link from 'next/link';
import {
  PlusIcon,
  UserPlusIcon,
  KeyIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { IUser } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  user: IUser;
}

interface QuickAction {
  name: string;
  description: string;
  href: string;
  icon: any;
  permission?: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

const quickActions: QuickAction[] = [
  {
    name: 'Add User',
    description: 'Invite new team members',
    href: '/dashboard/users/new',
    icon: UserPlusIcon,
    permission: 'users:write',
    color: 'blue'
  },
  {
    name: 'Create API Key',
    description: 'Generate new API access',
    href: '/dashboard/api-keys/new',
    icon: KeyIcon,
    permission: 'api-keys:write',
    color: 'green'
  },
  {
    name: 'View Analytics',
    description: 'Check performance metrics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    permission: 'analytics:read',
    color: 'purple'
  },
  {
    name: 'Add Content',
    description: 'Create new content',
    href: '/dashboard/content/new',
    icon: DocumentTextIcon,
    permission: 'content:write',
    color: 'yellow'
  },
  {
    name: 'System Settings',
    description: 'Configure application',
    href: '/dashboard/settings',
    icon: CogIcon,
    permission: 'settings:write',
    color: 'red'
  },
  {
    name: 'Notifications',
    description: 'Manage alerts',
    href: '/dashboard/notifications',
    icon: BellIcon,
    color: 'blue'
  }
];

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  red: 'bg-red-50 text-red-600 hover:bg-red-100',
  yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
};

export function QuickActions({ user }: QuickActionsProps) {
  // Filter actions based on user permissions
  const visibleActions = quickActions.filter(action => 
    !action.permission || RBAC.hasPermission(user, action.permission)
  );

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Commonly used features and shortcuts
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {visibleActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                colorVariants[action.color]
              )}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {action.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {action.description}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        {visibleActions.length === 0 && (
          <div className="text-center py-8">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No actions available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your current permissions don't allow these actions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}