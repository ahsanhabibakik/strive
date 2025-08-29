import {
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

interface TopMetricsProps {
  data: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
  };
}

const metrics = [
  {
    name: 'Total Users',
    key: 'totalUsers' as const,
    icon: UsersIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    format: (value: number) => value.toLocaleString(),
  },
  {
    name: 'New This Month',
    key: 'newUsersThisMonth' as const,
    icon: TrendingUpIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    format: (value: number) => `+${value.toLocaleString()}`,
  },
  {
    name: 'Active Subscriptions',
    key: 'activeSubscriptions' as const,
    icon: ChartBarIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    format: (value: number) => value.toLocaleString(),
  },
  {
    name: 'Monthly Revenue',
    key: 'monthlyRevenue' as const,
    icon: CurrencyDollarIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    format: (value: number) => `$${value.toLocaleString()}`,
  },
];

export function TopMetrics({ data }: TopMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const value = data[metric.key];
        const Icon = metric.icon;

        return (
          <div
            key={metric.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-xs hover:shadow-sm transition-shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-sm p-3 ${metric.bgColor}`}>
                <Icon className={`h-6 w-6 ${metric.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {metric.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {metric.format(value)}
              </p>
            </dd>
          </div>
        );
      })}
    </div>
  );
}