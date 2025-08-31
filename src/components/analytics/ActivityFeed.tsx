import {
  UserPlusIcon,
  CreditCardIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "user_signup" | "subscription" | "usage" | "admin";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Mock activity data - in real app, this would come from database
const getRecentActivity = (): ActivityItem[] => [
  {
    id: "1",
    type: "user_signup",
    title: "New user registered",
    description: "user@example.com signed up for a free account",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    metadata: { email: "user@example.com", plan: "free" },
  },
  {
    id: "2",
    type: "subscription",
    title: "Subscription upgraded",
    description: "Premium user upgraded from Pro to Enterprise",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: { fromPlan: "pro", toPlan: "enterprise" },
  },
  {
    id: "3",
    type: "usage",
    title: "API usage spike",
    description: "API calls increased by 45% compared to yesterday",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    metadata: { increase: "45%" },
  },
  {
    id: "4",
    type: "admin",
    title: "System backup completed",
    description: "Daily database backup completed successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    metadata: { size: "2.3GB", duration: "12 minutes" },
  },
  {
    id: "5",
    type: "user_signup",
    title: "Bulk user import",
    description: "15 new users imported via CSV upload",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    metadata: { count: 15, source: "csv_import" },
  },
];

const activityIcons = {
  user_signup: UserPlusIcon,
  subscription: CreditCardIcon,
  usage: ChartBarIcon,
  admin: ShieldCheckIcon,
};

const activityColors = {
  user_signup: "bg-green-50 text-green-600",
  subscription: "bg-blue-50 text-blue-600",
  usage: "bg-yellow-50 text-yellow-600",
  admin: "bg-purple-50 text-purple-600",
};

export function ActivityFeed() {
  const activities = getRecentActivity();

  return (
    <div className="bg-white rounded-lg shadow-2xs">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-500">Latest events and system activities</p>
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
                      <div className={`relative px-1 ${activityColors[activity.type]} rounded-lg`}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{activity.title}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">{activity.description}</p>
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

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all activity
            <span aria-hidden="true"> →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
