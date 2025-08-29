'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RevenueChartProps {
  monthlyRevenue: number;
}

export function RevenueChart({ monthlyRevenue }: RevenueChartProps) {
  // Mock data for revenue breakdown
  const revenueData = [
    { name: 'Pro Plan', value: monthlyRevenue * 0.6, color: '#3B82F6' },
    { name: 'Enterprise Plan', value: monthlyRevenue * 0.35, color: '#8B5CF6' },
    { name: 'Other', value: monthlyRevenue * 0.05, color: '#10B981' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-xs p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Revenue Breakdown</h3>
        <div className="text-sm text-gray-500">
          Total: ${monthlyRevenue.toLocaleString()}/month
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}