interface AnalyticsOverviewProps {
  data: {
    overview: {
      totalUsers: number;
      newUsersThisMonth: number;
      activeSubscriptions: number;
      monthlyRevenue: number;
    };
    usersByPlan: Record<string, number>;
  };
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const { overview, usersByPlan } = data;

  const conversionRate =
    overview.totalUsers > 0
      ? ((overview.activeSubscriptions / overview.totalUsers) * 100).toFixed(1)
      : "0";

  const planDistribution = [
    { name: "Free", count: usersByPlan.free || 0, color: "bg-gray-500" },
    { name: "Pro", count: usersByPlan.pro || 0, color: "bg-blue-500" },
    { name: "Enterprise", count: usersByPlan.enterprise || 0, color: "bg-purple-500" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-2xs p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Overview</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Metrics */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Key Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-lg font-semibold text-green-600">{conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Revenue Per User</span>
                <span className="text-lg font-semibold text-blue-600">
                  $
                  {overview.totalUsers > 0
                    ? (overview.monthlyRevenue / overview.totalUsers).toFixed(2)
                    : "0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-lg font-semibold text-purple-600">
                  {overview.totalUsers > 0
                    ? ((overview.newUsersThisMonth / overview.totalUsers) * 100).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Plan Distribution</h4>
          <div className="space-y-3">
            {planDistribution.map(plan => {
              const percentage =
                overview.totalUsers > 0
                  ? ((plan.count / overview.totalUsers) * 100).toFixed(1)
                  : "0";

              return (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${plan.color} mr-3`}></div>
                    <span className="text-sm text-gray-600">{plan.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{plan.count}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden">
              {planDistribution.map(plan => {
                const width =
                  overview.totalUsers > 0 ? (plan.count / overview.totalUsers) * 100 : 0;

                return (
                  <div key={plan.name} className={plan.color} style={{ width: `${width}%` }} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
