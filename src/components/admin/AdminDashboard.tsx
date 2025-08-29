"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Mail,
  Database,
  Activity,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface DashboardData {
  overview: {
    users: {
      total: number;
      active: number;
      inactive: number;
      new: number;
      byPlan: Record<string, number>;
      byRole: Record<string, number>;
    };
    projects: {
      total: number;
      active: number;
      new: number;
      completed: number;
      byStatus: Record<string, number>;
    };
    tasks: {
      total: number;
      completed: number;
      new: number;
      completionRate: number;
      byPriority: Record<string, number>;
      byStatus: Record<string, number>;
    };
    emails: {
      totalSent: number;
      totalDelivered: number;
      totalOpened: number;
      totalClicked: number;
      totalFailed: number;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      dailyVolume: Array<{ date: string; count: number }>;
    };
  };
  system: {
    status: "healthy" | "degraded" | "unhealthy";
    database: {
      status: string;
      collections?: number;
      dataSize?: number;
      indexSize?: number;
      storageSize?: number;
    };
    application: {
      uptime: number;
      memory: {
        used: number;
        total: number;
        rss: number;
      };
      nodeVersion: string;
      platform: string;
    };
  };
  revenue: {
    mrr: number;
    arr: number;
    totalSubscribers: number;
    byPlan: Array<{
      plan: string;
      subscribers: number;
      monthlyRevenue: number;
    }>;
  };
  growth: {
    userGrowth: Array<{ date: string; users: number }>;
    totalGrowth: number;
  };
  activity: {
    users: Array<any>;
    projects: Array<any>;
    emails: Array<any>;
  };
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/dashboard");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="ml-2 text-sm font-medium text-red-800">Error loading dashboard</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <Button onClick={fetchDashboardData} variant="outline" size="sm" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "unhealthy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor your application's health and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(data.system.status)}>
            {data.system.status === "healthy" && <CheckCircle className="w-3 h-3 mr-1" />}
            {data.system.status === "degraded" && <AlertTriangle className="w-3 h-3 mr-1" />}
            {data.system.status === "unhealthy" && <AlertTriangle className="w-3 h-3 mr-1" />}
            System {data.system.status}
          </Badge>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{data.overview.users.new} new this month
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {data.overview.users.active} active
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {data.overview.users.inactive} inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.revenue.mrr.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${data.revenue.arr.toLocaleString()} ARR
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {data.revenue.totalSubscribers} subscribers
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.projects.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{data.overview.projects.new} new this month
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {data.overview.projects.active} active
              </Badge>
              <Badge className="text-xs bg-green-100 text-green-800">
                {data.overview.projects.completed} completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Emails */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Performance</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.emails.totalSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">emails sent</p>
            <div className="mt-2 space-y-1">
              <div className="text-xs text-gray-600">
                Delivery: {data.overview.emails.deliveryRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">
                Open: {data.overview.emails.openRate.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Database */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge className={getStatusColor(data.system.database.status)}>
                  {data.system.database.status}
                </Badge>
              </div>

              {data.system.database.collections && (
                <div className="pl-6 space-y-1 text-xs text-gray-600">
                  <div>Collections: {data.system.database.collections}</div>
                  <div>Data Size: {formatBytes(data.system.database.dataSize || 0)}</div>
                  <div>Storage Size: {formatBytes(data.system.database.storageSize || 0)}</div>
                </div>
              )}

              {/* Application */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Application</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Running</Badge>
              </div>

              <div className="pl-6 space-y-1 text-xs text-gray-600">
                <div>Uptime: {formatUptime(data.system.application.uptime)}</div>
                <div>
                  Memory: {formatBytes(data.system.application.memory.used)} /{" "}
                  {formatBytes(data.system.application.memory.total)}
                </div>
                <div>Node: {data.system.application.nodeVersion}</div>
                <div>Platform: {data.system.application.platform}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Revenue by Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenue.byPlan.map(plan => (
                <div key={plan.plan} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{plan.plan}</div>
                    <div className="text-sm text-gray-500">{plan.subscribers} subscribers</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${plan.monthlyRevenue.toLocaleString()}/mo</div>
                    <div className="text-sm text-gray-500">
                      ${(plan.monthlyRevenue * 12).toLocaleString()}/yr
                    </div>
                  </div>
                </div>
              ))}

              {data.revenue.byPlan.length === 0 && (
                <div className="text-center text-gray-500 py-4">No active subscriptions</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recent Users */}
            <div>
              <h4 className="font-medium text-sm mb-2">New Users</h4>
              <div className="space-y-2">
                {data.activity.users.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>{activity.user.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {activity.user.role}
                      </Badge>
                    </div>
                    <span className="text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {data.activity.users.length === 0 && (
                  <div className="text-gray-500 text-sm">No recent user activity</div>
                )}
              </div>
            </div>

            {/* Recent Emails */}
            <div>
              <h4 className="font-medium text-sm mb-2">Recent Emails</h4>
              <div className="space-y-2">
                {data.activity.emails.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="truncate max-w-xs">{activity.email.subject}</span>
                      <Badge
                        variant="outline"
                        className={`ml-2 text-xs ${
                          activity.email.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : activity.email.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {activity.email.status}
                      </Badge>
                    </div>
                    <span className="text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {data.activity.emails.length === 0 && (
                  <div className="text-gray-500 text-sm">No recent email activity</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
