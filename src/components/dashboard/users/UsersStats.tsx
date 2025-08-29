import {
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface UsersStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    admins: number;
    moderators: number;
    users: number;
    newThisMonth: number;
  };
}

const statsConfig = [
  {
    name: 'Total Users',
    key: 'total' as const,
    icon: UsersIcon,
    color: 'blue'
  },
  {
    name: 'Active Users',
    key: 'active' as const,
    icon: CheckCircleIcon,
    color: 'green'
  },
  {
    name: 'Inactive Users',
    key: 'inactive' as const,
    icon: XCircleIcon,
    color: 'gray'
  },
  {
    name: 'Administrators',
    key: 'admins' as const,
    icon: ShieldCheckIcon,
    color: 'red'
  },
  {
    name: 'New This Month',
    key: 'newThisMonth' as const,
    icon: CalendarIcon,
    color: 'purple'
  }
];

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  gray: 'bg-gray-50 text-gray-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
};

export function UsersStats({ stats }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {statsConfig.map((stat) => {
        const colorClass = colorVariants[stat.color as keyof typeof colorVariants];
        const value = stats[stat.key];
        
        return (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm hover:shadow-md transition-shadow sm:px-6"
          >
            <dt>
              <div className={cn('absolute rounded-md p-3', colorClass)}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {value.toLocaleString()}
              </p>
            </dd>
          </div>
        );
      })}
    </div>
  );
}