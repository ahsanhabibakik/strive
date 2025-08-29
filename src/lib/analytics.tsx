"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";

// Google Analytics (gtag) functions
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Initialize Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Enhanced tracking for universal usage
export const trackSignUp = (method: string) => {
  event({
    action: "sign_up",
    category: "authentication",
    label: method,
  });
};

export const trackLogin = (method: string) => {
  event({
    action: "login",
    category: "authentication",
    label: method,
  });
};

export const trackNewsletter = (location: string) => {
  event({
    action: "subscribe",
    category: "newsletter",
    label: location,
  });
};

export const trackContactForm = (subject: string) => {
  event({
    action: "contact_form_submit",
    category: "engagement",
    label: subject,
  });
};

export const trackSearch = (searchTerm: string, resultCount: number) => {
  event({
    action: "search",
    category: "search",
    label: searchTerm,
    value: resultCount,
  });
};

export const trackDownload = (fileName: string) => {
  event({
    action: "download",
    category: "engagement",
    label: fileName,
  });
};

export const trackShare = (contentType: string, platform: string) => {
  event({
    action: "share",
    category: "social",
    label: `${contentType} via ${platform}`,
  });
};

export const trackAPIUsage = (endpoint: string, success: boolean, responseTime?: number) => {
  event({
    action: "api_call",
    category: "technical",
    label: `${endpoint}:${success ? "success" : "error"}`,
    value: responseTime ? Math.round(responseTime) : undefined,
  });
};

export const trackPerformance = (metric: string, value: number, page: string) => {
  event({
    action: "performance_metric",
    category: "technical",
    label: `${page}:${metric}`,
    value: Math.round(value),
  });
};

// Mixpanel integration
let mixpanel: {
  track: (name: string, props?: Record<string, unknown>) => void;
  init: (token: string, config?: Record<string, unknown>) => void;
  identify: (userId: string) => void;
  people: { set: (props: Record<string, unknown>) => void };
} | null = null;

export const initMixpanel = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    import("mixpanel-browser").then(mp => {
      mixpanel = mp.default;
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
        debug: process.env.NODE_ENV === "development",
        track_pageview: true,
        persistence: "localStorage",
      });
    });
  }
};

export const mixpanelTrack = (eventName: string, properties?: Record<string, unknown>) => {
  if (mixpanel) {
    mixpanel.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      page: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }
};

export const mixpanelIdentify = (userId: string, userProperties?: Record<string, unknown>) => {
  if (mixpanel) {
    mixpanel.identify(userId);
    if (userProperties) {
      mixpanel.people.set(userProperties);
    }
  }
};

// Combined tracking function for all analytics platforms
export const trackEvent = (
  eventName: string,
  properties: {
    category: string;
    action: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
  }
) => {
  // Google Analytics
  event({
    action: properties.action,
    category: properties.category,
    label: properties.label,
    value: properties.value,
  });

  // Mixpanel
  mixpanelTrack(eventName, properties);

  // Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", eventName, properties);
  }
};

// E-commerce tracking
export const ecommerceTracking = {
  purchaseInitiated: (items: { id: string; name: string; price: number }[], value: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "USD",
        value: value,
        items: items,
      });
    }
    mixpanelTrack("Purchase Initiated", { items, value });
  },

  purchaseCompleted: (
    transactionId: string,
    items: { id: string; name: string; price: number }[],
    value: number
  ) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: transactionId,
        currency: "USD",
        value: value,
        items: items,
      });
    }
    mixpanelTrack("Purchase Completed", { transaction_id: transactionId, items, value });
  },
};

// Cookie consent handling
export const handleCookieConsent = (consent: boolean) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: consent ? "granted" : "denied",
      ad_storage: consent ? "granted" : "denied",
    });
  }

  localStorage.setItem("cookie_consent", consent.toString());

  if (consent) {
    initMixpanel();
  }
};

// Check if user has given consent
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") return false;
  const consent = localStorage.getItem("cookie_consent");
  return consent === "true";
};

// Initialize analytics with consent check
export const initAnalytics = () => {
  if (hasAnalyticsConsent()) {
    initMixpanel();
  }
};

// Performance monitoring
export const measurePerformance = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

    if (navigation) {
      // Core Web Vitals and other metrics
      const ttfb = navigation.responseStart - navigation.fetchStart;
      const domLoad = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      const pageLoad = navigation.loadEventEnd - navigation.loadEventStart;

      trackPerformance("TTFB", ttfb, window.location.pathname);
      trackPerformance("DOM_LOAD", domLoad, window.location.pathname);
      trackPerformance("PAGE_LOAD", pageLoad, window.location.pathname);
    }

    // Track FCP and LCP if available
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "paint") {
            trackPerformance(
              entry.name.toUpperCase().replace("-", "_"),
              entry.startTime,
              window.location.pathname
            );
          } else if (entry.entryType === "largest-contentful-paint") {
            trackPerformance("LCP", entry.startTime, window.location.pathname);
          }
        }
      });

      observer.observe({ entryTypes: ["paint", "largest-contentful-paint"] });
    }
  }
};

// Universal event tracking for any website
export const universalTracking = {
  pageView: (page: string, title?: string) => {
    pageview(page);
    mixpanelTrack("Page View", { page, title });
  },

  userAction: (action: string, category: string, label?: string, value?: number) => {
    trackEvent(`User ${action}`, { category, action, label, value });
  },

  businessGoal: (goal: string, value?: number, metadata?: Record<string, unknown>) => {
    trackEvent("Business Goal", {
      category: "conversion",
      action: goal,
      value,
      ...metadata,
    });
  },

  error: (error: string, page: string, severity: "low" | "medium" | "high" = "medium") => {
    trackEvent("Error Occurred", {
      category: "technical",
      action: "error",
      label: `${page}:${error}`,
      severity,
    });
  },

  featureUsage: (feature: string, context?: string) => {
    trackEvent("Feature Used", {
      category: "product",
      action: "feature_usage",
      label: feature,
      context,
    });
  },
};

// Export analytics object for easier importing
export const analytics = {
  ...universalTracking,
  trackSignUp,
  trackLogin,
  trackNewsletter,
  trackContactForm,
  trackSearch,
  trackDownload,
  trackShare,
  trackAPIUsage,
  trackPerformance,
  ecommerceTracking,
  measurePerformance,
  trackEvent,
  initAnalytics,
};

// React hook for analytics
export const useAnalytics = () => {
  const hasConsent = hasAnalyticsConsent();

  return {
    hasConsent,
    grantConsent: () => handleCookieConsent(true),
    revokeConsent: () => handleCookieConsent(false),
    track: trackEvent,
    analytics,
  };
};

// React component for analytics provider

interface AnalyticsContextType {
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
  track: typeof trackEvent;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasConsent, setHasConsent] = React.useState<boolean>(false);

  useEffect(() => {
    // Check consent on mount
    setHasConsent(hasAnalyticsConsent());

    // Initialize analytics if consent is already given
    if (hasAnalyticsConsent()) {
      initAnalytics();
    }
  }, []);

  const grantConsent = () => {
    handleCookieConsent(true);
    setHasConsent(true);
  };

  const revokeConsent = () => {
    handleCookieConsent(false);
    setHasConsent(false);
  };

  const value: AnalyticsContextType = {
    hasConsent,
    grantConsent,
    revokeConsent,
    track: trackEvent,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalyticsContext must be used within an AnalyticsProvider");
  }
  return context;
};
