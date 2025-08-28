"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { PerformanceMonitor } from "@/components/analytics/PerformanceMonitor";
import { initAnalytics } from "@/lib/analytics";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <GoogleAnalytics />
        <GoogleTagManager />
        <VercelAnalytics />
        <PerformanceMonitor />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <CookieConsent />
      </div>
    </SessionProvider>
  );
};