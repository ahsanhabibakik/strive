"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  EyeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CogIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  type: "billing" | "security" | "system" | "feature" | "maintenance";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationCenterProps {
  notifications: Notification[];
  userId: string;
}

export function NotificationCenter({
  notifications: initialNotifications,
  userId,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | Notification["type"]>("all");
  const [loading, setLoading] = useState(false);

  const getNotificationIcon = (type: Notification["type"], read: boolean) => {
    const iconClass = `h-6 w-6 ${read ? "text-gray-400" : "text-indigo-600"}`;

    switch (type) {
      case "billing":
        return <CreditCardIcon className={iconClass} />;
      case "security":
        return <ShieldCheckIcon className={iconClass} />;
      case "system":
        return <CogIcon className={iconClass} />;
      case "feature":
        return <SparklesIcon className={iconClass} />;
      case "maintenance":
        return <WrenchScrewdriverIcon className={iconClass} />;
      default:
        return <BellIcon className={iconClass} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "billing":
        return "bg-green-50 border-green-200";
      case "security":
        return "bg-red-50 border-red-200";
      case "system":
        return "bg-yellow-50 border-yellow-200";
      case "feature":
        return "bg-blue-50 border-blue-200";
      case "maintenance":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const markAsRead = async (notificationId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(prev =>
        prev.map(notif => (notif.id === notificationId ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "billing",
      label: "Billing",
      count: notifications.filter(n => n.type === "billing").length,
    },
    {
      key: "security",
      label: "Security",
      count: notifications.filter(n => n.type === "security").length,
    },
    {
      key: "system",
      label: "System",
      count: notifications.filter(n => n.type === "system").length,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <BellIcon className="h-6 w-6 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notification Center</h3>
              <p className="text-sm text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} disabled={loading} variant="outline" size="sm">
                <CheckIcon className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}

            <div className="relative">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {filters.map(f => (
                  <option key={f.key} value={f.key}>
                    {f.label} ({f.count})
                  </option>
                ))}
              </select>
              <FunnelIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "unread"
                ? "You're all caught up! No unread notifications."
                : "No notifications match your current filter."}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="shrink-0">
                    {getNotificationIcon(notification.type, notification.read)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-x-2 mb-1">
                      <h4
                        className={`text-sm font-medium ${
                          notification.read ? "text-gray-900" : "text-gray-900 font-semibold"
                        }`}
                      >
                        {notification.title}
                      </h4>

                      {!notification.read && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
                      )}

                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getNotificationColor(notification.type)} ${
                          notification.type === "billing"
                            ? "text-green-700 ring-green-600/20"
                            : notification.type === "security"
                              ? "text-red-700 ring-red-600/20"
                              : notification.type === "system"
                                ? "text-yellow-700 ring-yellow-600/20"
                                : notification.type === "feature"
                                  ? "text-blue-700 ring-blue-600/20"
                                  : notification.type === "maintenance"
                                    ? "text-orange-700 ring-orange-600/20"
                                    : "text-gray-700 ring-gray-600/20"
                        }`}
                      >
                        {notification.type}
                      </span>
                    </div>

                    <p
                      className={`text-sm ${
                        notification.read ? "text-gray-600" : "text-gray-800"
                      } mb-2`}
                    >
                      {notification.message}
                    </p>

                    <p className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</p>

                    {/* Notification-specific data */}
                    {notification.data && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        {notification.type === "billing" && (
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium">
                                ${(notification.data.amount / 100).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Plan:</span>
                              <span className="font-medium">{notification.data.planName}</span>
                            </div>
                          </div>
                        )}

                        {notification.type === "security" && (
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Device:</span>
                              <span className="font-medium">{notification.data.device}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Location:</span>
                              <span className="font-medium">{notification.data.location}</span>
                            </div>
                          </div>
                        )}

                        {notification.type === "system" && notification.data.usage && (
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Usage:</span>
                              <span className="font-medium">{notification.data.usage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${notification.data.usage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </span>
            <Button variant="outline" size="sm">
              View notification settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
