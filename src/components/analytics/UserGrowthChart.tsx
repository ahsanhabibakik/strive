"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserGrowthChartProps {
  data: Array<{
    month: string;
    users: number;
  }>;
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">New Users: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Transform data to include cumulative users
  let cumulativeUsers = 0;
  const chartData = data.map(item => {
    cumulativeUsers += item.users;
    return {
      ...item,
      cumulative: cumulativeUsers,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-2xs p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
        <div className="text-sm text-gray-500">Last 6 months</div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-600">New Users</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Cumulative</span>
        </div>
      </div>
    </div>
  );
}
