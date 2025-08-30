"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { PerformanceMonitor } from "@/components/analytics/PerformanceMonitor";
import { initAnalytics } from "@/lib/analytics";
import ReduxProvider from "./ReduxProvider";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  // Don't show layout navbar/footer only on dashboard pages
  const shouldShowLayout = !pathname.startsWith("/dashboard");

  return (
    <ErrorBoundary>
      <ReduxProvider>
        <SessionProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <GoogleAnalytics />
            <GoogleTagManager />
            <VercelAnalytics />
            <PerformanceMonitor />
            <main
              className={shouldShowLayout ? "container mx-auto px-4 py-8 flex-grow" : "flex-grow"}
            >
              {children}
            </main>
            <Toaster />
          </div>
        </SessionProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};
