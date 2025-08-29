"use client";

import { IUser } from "@/lib/models/User";
import { SubscriptionPlanData } from "@/lib/stripe/config";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

interface SubscriptionOverviewProps {
  user: IUser;
  currentPlan: SubscriptionPlanData;
}

export function SubscriptionOverview({ user, currentPlan }: SubscriptionOverviewProps) {
  const subscription = user.subscription;

  const getStatusBadge = () => {
    const status = subscription?.status || "free";

    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            <CheckCircleIcon className="h-4 w-4" />
            Active
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            <ExclamationTriangleIcon className="h-4 w-4" />
            Cancelled
          </span>
        );
      case "past_due":
        return (
          <span className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
            <ExclamationTriangleIcon className="h-4 w-4" />
            Past Due
          </span>
        );
      case "trialing":
        return (
          <span className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            <ClockIcon className="h-4 w-4" />
            Trial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            Free
          </span>
        );
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/billing/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Current Subscription</h2>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-x-3 mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
              {getStatusBadge()}
            </div>

            <p className="text-gray-600 mb-4">{currentPlan.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  ${currentPlan.price}
                  <span className="text-sm font-normal text-gray-500">/{currentPlan.interval}</span>
                </dd>
              </div>

              {subscription?.currentPeriodStart && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Started</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(subscription.currentPeriodStart)}
                  </dd>
                </div>
              )}

              {subscription?.currentPeriodEnd && subscription.status !== "cancelled" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">Next billing</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(subscription.currentPeriodEnd)}
                  </dd>
                </div>
              )}

              {subscription?.currentPeriodEnd && subscription.status === "cancelled" && (
                <div className="bg-red-50 rounded-lg p-4">
                  <dt className="text-sm font-medium text-red-600">Expires</dt>
                  <dd className="mt-1 text-sm text-red-900">
                    {formatDate(subscription.currentPeriodEnd)}
                  </dd>
                </div>
              )}
            </div>

            {/* Plan Features */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Features</h4>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ml-6">
            {subscription?.customerId && subscription.plan !== "free" && (
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="flex items-center gap-x-2"
              >
                <CreditCardIcon className="h-4 w-4" />
                Manage Billing
              </Button>
            )}
          </div>
        </div>

        {/* Usage or Limits */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Usage This Month</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">1,247</div>
              <div className="text-xs text-gray-500">API Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">3</div>
              <div className="text-xs text-gray-500">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">12</div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">98.5%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
          </div>
        </div>

        {/* Alerts or Notifications */}
        {(subscription?.status as any) === "past_due" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Payment Past Due</h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Your payment is overdue. Please update your payment method to avoid service
                  interruption.
                </p>
                <div className="mt-4">
                  <Button
                    onClick={handleManageSubscription}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {subscription?.status === "cancelled" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Subscription Cancelled</h3>
                <p className="mt-2 text-sm text-red-700">
                  Your subscription has been cancelled and will expire on{" "}
                  {formatDate(subscription.currentPeriodEnd)}. You can reactivate it anytime before
                  then.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
