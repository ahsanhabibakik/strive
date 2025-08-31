import { UsersIcon, ShieldCheckIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { IUser } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalModerators: number;
    activeSubscriptions: number;
  };
  user: IUser;
}

const statsConfig = [
  {
    name: "Total Users",
    key: "totalUsers" as const,
    icon: UsersIcon,
    color: "blue",
    permission: "users:read",
    href: "/dashboard/users",
  },
  {
    name: "Active Subscriptions",
    key: "activeSubscriptions" as const,
    icon: CreditCardIcon,
    color: "green",
    permission: "billing:read",
    href: "/dashboard/billing",
  },
  {
    name: "Administrators",
    key: "totalAdmins" as const,
    icon: ShieldCheckIcon,
    color: "red",
    permission: "users:admin",
    href: "/dashboard/users?filter=admin",
  },
  {
    name: "Moderators",
    key: "totalModerators" as const,
    icon: UsersIcon,
    color: "yellow",
    permission: "users:read",
    href: "/dashboard/users?filter=moderator",
  },
];

const colorVariants = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    text: "text-green-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    text: "text-red-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    icon: "text-yellow-600",
    text: "text-yellow-600",
  },
};

export function DashboardStats({ stats, user }: DashboardStatsProps) {
  // Filter stats based on user permissions
  const visibleStats = statsConfig.filter(
    stat => !stat.permission || RBAC.hasPermission(user, stat.permission)
  );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {visibleStats.map(stat => {
        const colorClass = colorVariants[stat.color as keyof typeof colorVariants];
        const value = stats[stat.key];

        return (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-2xs hover:shadow-md transition-shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={cn("absolute rounded-md p-3", colorClass.bg)}>
                <stat.icon className={cn("h-6 w-6", colorClass.icon)} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
            </dd>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-50 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}
