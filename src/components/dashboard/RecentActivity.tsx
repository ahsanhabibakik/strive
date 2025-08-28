import { 
  UserIcon,
  KeyIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '@/lib/utils';
import { IUser } from '@/lib/models/User';

interface RecentActivityProps {
  user: IUser;
}

interface ActivityItem {
  id: string;
  type: 'user' | 'api-key' | 'content' | 'billing' | 'security' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    email: string;
  };
  severity?: 'info' | 'warning' | 'error';
}

// Mock activity data - in real app, this would come from database
const getMockActivity = (): ActivityItem[] => [
  {
    id: '1',
    type: 'user',
    title: 'New user registered',
    description: 'john.doe@example.com joined the platform',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    user: { name: 'John Doe', email: 'john.doe@example.com' },
    severity: 'info'
  },
  {
    id: '2',
    type: 'api-key',
    title: 'API key created',
    description: 'Production API key generated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    user: { name: 'Admin User', email: 'admin@example.com' },
    severity: 'info'
  },
  {
    id: '3',
    type: 'billing',
    title: 'Subscription upgraded',
    description: 'User upgraded to Pro plan',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    severity: 'info'
  },
  {
    id: '4',
    type: 'security',
    title: 'Failed login attempts',
    description: '5 failed login attempts detected',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    severity: 'warning'
  },
  {
    id: '5',
    type: 'content',
    title: 'Content published',
    description: 'New blog post "Getting Started" published',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    user: { name: 'Content Manager', email: 'content@example.com' },
    severity: 'info'
  }
];

const activityIcons = {
  user: UserIcon,
  'api-key': KeyIcon,
  content: DocumentTextIcon,
  billing: CreditCardIcon,
  security: ShieldCheckIcon,
  system: ExclamationTriangleIcon,
};

const severityColors = {
  info: 'bg-blue-50 text-blue-600',
  warning: 'bg-yellow-50 text-yellow-600',
  error: 'bg-red-50 text-red-600',
};

export function RecentActivity({ user: _user }: RecentActivityProps) {
  const activities = getMockActivity();

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-500">
          Latest events and actions in your application
        </p>
      </div>
      
      <div className="p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => {
              const Icon = activityIcons[activity.type];
              const isLast = activityIdx === activities.length - 1;
              
              return (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {!isLast && (
                      <span
                        className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    
                    <div className="relative flex items-start space-x-3">
                      <div className={`relative px-1 ${severityColors[activity.severity || 'info']} rounded-lg`}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {activity.title}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {activity.description}
                          </p>
                          {activity.user && (
                            <p className="mt-0.5 text-xs text-gray-400">
                              by {activity.user.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-700">
                          <time dateTime={activity.timestamp.toISOString()}>
                            {formatRelativeTime(activity.timestamp)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}