"use client";

import { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "cancelled";
  description: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  currency: string;
}

interface BillingHistoryProps {
  customerId?: string | null;
}

export function BillingHistory({ customerId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchInvoices();
    } else {
      setLoading(false);
    }
  }, [customerId]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`/api/billing/invoices?customerId=${customerId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (err) {
      setError("Failed to load billing history");
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const baseClasses =
      "inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium";

    switch (status) {
      case "paid":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircleIcon className="h-3 w-3" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <ClockIcon className="h-3 w-3" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <ExclamationCircleIcon className="h-3 w-3" />
            Failed
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <XCircleIcon className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</span>;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Stripe amounts are in cents
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!customerId) {
    return (
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No billing history</h3>
            <p className="mt-1 text-sm text-gray-500">
              Subscribe to a plan to view your billing history here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Error loading billing history
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button onClick={fetchInvoices} variant="outline" className="mt-4">
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        <p className="mt-1 text-sm text-gray-500">
          Download receipts and view your payment history
        </p>
      </div>

      <div className="p-6">
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your billing history will appear here once you have invoices.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map(invoice => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(invoice.status)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{invoice.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(invoice.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {getStatusBadge(invoice.status)}

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {invoice.invoiceUrl && (
                      <Button
                        onClick={() => window.open(invoice.invoiceUrl, "_blank")}
                        variant="outline"
                        size="sm"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}

                    {invoice.receiptUrl && invoice.status === "paid" && (
                      <Button
                        onClick={() => window.open(invoice.receiptUrl, "_blank")}
                        variant="outline"
                        size="sm"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {invoices.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            Need help with billing? Contact our{" "}
            <a href="mailto:support@strive.com" className="text-indigo-600 hover:text-indigo-500">
              support team
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
