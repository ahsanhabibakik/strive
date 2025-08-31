"use client";

import { BellIcon, EnvelopeOpenIcon, EyeIcon, ClockIcon } from "@heroicons/react/24/outline";

interface NotificationStatsProps {
  stats: {
    total: number;
    unread: number;
    categories: {
      billing: number;
      security: number;
      system: number;
      feature: number;
      maintenance: number;
    };
    weekly: Array<{
      date: string;
      count: number;
    }>;
  };
}

export function NotificationStats({ stats }: NotificationStatsProps) {
  const readPercentage = stats.total > 0 ? ((stats.total - stats.unread) / stats.total) * 100 : 0;

  const maxWeeklyCount = Math.max(...stats.weekly.map(day => day.count));

  const getCategoryIcon = (category: string) => {
    const iconClass = "h-4 w-4 text-gray-400";

    switch (category) {
      case "billing":
        return "💳";
      case "security":
        return "🔒";
      case "system":
        return "⚙️";
      case "feature":
        return "✨";
      case "maintenance":
        return "🔧";
      default:
        return "📋";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Overview Cards */}
      <div className="lg:col-span-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-2xs border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <BellIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-2xs border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <EnvelopeOpenIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-2xs border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <EyeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Read Rate</p>
                <p className="text-2xl font-bold text-gray-900">{readPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-2xs border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.weekly.reduce((sum, day) => sum + day.count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Weekly Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.weekly.map((day, index) => {
                const percentage = maxWeeklyCount > 0 ? (day.count / maxWeeklyCount) * 100 : 0;
                const dayName = new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                });

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-gray-600">{dayName}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            day.count > 0 ? "bg-indigo-500" : "bg-gray-200"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-right text-sm font-medium text-gray-900">
                      {day.count}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Average: {(stats.weekly.reduce((sum, day) => sum + day.count, 0) / 7).toFixed(1)}{" "}
                notifications per day
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="lg:col-span-4">
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Stay Updated</h3>
              <p className="text-indigo-100 text-sm mt-1">
                Customize your notification preferences to get the most relevant updates
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Notification Settings
              </button>
              <button className="bg-white text-indigo-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
