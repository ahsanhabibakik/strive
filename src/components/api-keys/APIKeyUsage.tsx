"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface UsageData {
  current: {
    requests: number;
    limit: number;
    percentage: number;
  };
  daily: Array<{
    date: string;
    requests: number;
  }>;
  rateLimit: {
    remaining: number;
    limit: number;
    resetTime: string;
  };
  plan: {
    name: string;
    monthlyLimit: number;
    rateLimit: number;
  };
}

interface APIKeyUsageProps {
  userId: string;
}

export function APIKeyUsage({ userId }: APIKeyUsageProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, [userId]);

  const fetchUsage = async () => {
    try {
      const response = await fetch(`/api/user/api-usage?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch usage data");
      }

      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">API Usage</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">API Usage</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No usage data</h3>
            <p className="mt-1 text-sm text-gray-500">
              Usage statistics will appear here once you start making API calls.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Usage */}
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-x-3">
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Monthly Usage</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {usage.current.requests.toLocaleString()} / {usage.current.limit.toLocaleString()}{" "}
                requests
              </span>
              <span className={`text-sm font-medium ${getUsageColor(usage.current.percentage)}`}>
                {usage.current.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getProgressColor(usage.current.percentage)}`}
                style={{ width: `${Math.min(usage.current.percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-1">
              Plan: <span className="font-medium">{usage.plan.name}</span>
            </p>
            <p>Resets on the 1st of each month</p>
          </div>

          {usage.current.percentage >= 90 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">Usage Limit Warning</h4>
                  <p className="text-sm text-red-700 mt-1">
                    You're approaching your monthly API limit. Consider upgrading your plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-x-3">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Rate Limiting</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Remaining requests</span>
              <span className="text-sm font-medium text-gray-900">
                {usage.rateLimit.remaining} / {usage.rateLimit.limit}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rate limit</span>
              <span className="text-sm font-medium text-gray-900">
                {usage.plan.rateLimit} requests/minute
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Resets at</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(usage.rateLimit.resetTime).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="mt-4">
            {usage.rateLimit.remaining > usage.rateLimit.limit * 0.1 ? (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Rate limit healthy
              </div>
            ) : (
              <div className="flex items-center text-sm text-yellow-600">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                Approaching rate limit
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Daily Usage (Last 7 Days)</h3>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {usage.daily.map((day, index) => {
              const maxRequests = Math.max(...usage.daily.map(d => d.requests));
              const percentage = maxRequests > 0 ? (day.requests / maxRequests) * 100 : 0;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                    {day.requests.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {usage.daily.every(day => day.requests === 0) && (
            <div className="text-center py-6 text-gray-500">
              <ChartBarIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm">No API requests in the last 7 days</p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="p-6">
          <h4 className="text-sm font-medium text-indigo-900 mb-2">Optimization Tips</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Cache API responses when possible</li>
            <li>• Use batch requests to reduce API calls</li>
            <li>• Implement exponential backoff for retries</li>
            <li>• Monitor your usage regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
