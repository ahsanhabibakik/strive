"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { GoogleAnalytics } from "./google-analytics";
import { MicrosoftClarity } from "./microsoft-clarity";
import { Hotjar } from "./hotjar";
import { PostHog } from "./posthog";
import { Mixpanel } from "./mixpanel";
import { FacebookPixel } from "./facebook-pixel";
import { clarityUtils } from "./microsoft-clarity";
import { hotjarUtils } from "./hotjar";
import { posthogUtils } from "./posthog";
import { mixpanelUtils } from "./mixpanel";
import { facebookPixelUtils } from "./facebook-pixel";

interface AnalyticsContextType {
  // Consent management
  hasConsent: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;

  // User identification
  identifyUser: (userId: string, properties?: Record<string, any>) => void;

  // Event tracking
  track: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (pageName?: string, properties?: Record<string, any>) => void;

  // E-commerce tracking
  trackPurchase: (transactionData: {
    transactionId: string;
    value: number;
    currency: string;
    items?: any[];
  }) => void;

  // Goal tracking specific events
  trackGoalCreated: (goalData: {
    goalType: string;
    targetDate?: string;
    priority?: string;
  }) => void;
  trackGoalCompleted: (goalData: {
    goalId: string;
    completionTime: number;
    category: string;
  }) => void;
  trackGoalProgress: (goalData: { goalId: string; progress: number; milestone?: string }) => void;

  // Subscription tracking
  trackSubscription: (subscriptionData: { plan: string; value: number; currency: string }) => void;

  // Form interactions
  trackFormSubmit: (formName: string, formData?: Record<string, any>) => void;
  trackFormError: (formName: string, errorType: string, fieldName?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const [hasConsent, setHasConsent] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check for stored consent
    const storedConsent = localStorage.getItem("analytics-consent");
    if (storedConsent === "granted") {
      setHasConsent(true);
    }
  }, []);

  const grantConsent = () => {
    setHasConsent(true);
    localStorage.setItem("analytics-consent", "granted");

    // Initialize all analytics tools
    if (typeof window !== "undefined") {
      // PostHog consent
      posthogUtils.optIn();
      // Mixpanel consent
      mixpanelUtils.optIn();
    }
  };

  const revokeConsent = () => {
    setHasConsent(false);
    localStorage.setItem("analytics-consent", "revoked");

    // Opt out of all analytics
    if (typeof window !== "undefined") {
      posthogUtils.optOut();
      mixpanelUtils.optOut();
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (!hasConsent) return;

    // Identify user across all platforms
    clarityUtils.identify(userId, undefined, undefined, properties?.name);
    hotjarUtils.identify(userId, properties);
    posthogUtils.identify(userId, properties);
    mixpanelUtils.identify(userId);

    if (properties) {
      posthogUtils.setPersonProperties(properties);
      mixpanelUtils.setUserProperties(properties);
    }
  };

  const track = (eventName: string, properties?: Record<string, any>) => {
    if (!hasConsent) return;

    // Track across all platforms with consistent event names
    clarityUtils.event(eventName, properties);
    hotjarUtils.event(eventName);
    posthogUtils.track(eventName, properties);
    mixpanelUtils.track(eventName, properties);
    facebookPixelUtils.trackCustom(eventName, properties);
  };

  const trackPageView = (pageName?: string, properties?: Record<string, any>) => {
    if (!hasConsent) return;

    const pageData = {
      page: pageName || window.location.pathname,
      ...properties,
    };

    posthogUtils.track("$pageview", pageData);
    mixpanelUtils.trackPageView(pageName, properties);
    facebookPixelUtils.trackPageView();
  };

  const trackPurchase = (transactionData: {
    transactionId: string;
    value: number;
    currency: string;
    items?: any[];
  }) => {
    if (!hasConsent) return;

    const { transactionId, value, currency, items } = transactionData;

    // Track purchase across platforms
    posthogUtils.track("purchase", {
      transaction_id: transactionId,
      revenue: value,
      currency,
      items,
    });

    mixpanelUtils.track("Purchase", {
      "Transaction ID": transactionId,
      Revenue: value,
      Currency: currency,
      "Items Count": items?.length || 0,
    });

    mixpanelUtils.trackCharge(value, {
      "Transaction ID": transactionId,
      Currency: currency,
    });

    facebookPixelUtils.trackPurchase({
      value,
      currency,
      content_name: "Subscription",
      content_type: "product",
    });
  };

  const trackGoalCreated = (goalData: {
    goalType: string;
    targetDate?: string;
    priority?: string;
  }) => {
    if (!hasConsent) return;

    track("goal_created", {
      goal_type: goalData.goalType,
      target_date: goalData.targetDate,
      priority: goalData.priority,
      timestamp: new Date().toISOString(),
    });

    // Tag user as goal creator
    clarityUtils.setTag("user_type", "goal_creator");
    hotjarUtils.tagRecording(["goal-creator"]);
  };

  const trackGoalCompleted = (goalData: {
    goalId: string;
    completionTime: number;
    category: string;
  }) => {
    if (!hasConsent) return;

    track("goal_completed", {
      goal_id: goalData.goalId,
      completion_time_days: goalData.completionTime,
      category: goalData.category,
      timestamp: new Date().toISOString(),
    });

    // Track as conversion
    facebookPixelUtils.track("CompleteRegistration", {
      content_name: "Goal Completion",
      value: 1,
    });
  };

  const trackGoalProgress = (goalData: {
    goalId: string;
    progress: number;
    milestone?: string;
  }) => {
    if (!hasConsent) return;

    track("goal_progress_updated", {
      goal_id: goalData.goalId,
      progress_percentage: goalData.progress,
      milestone: goalData.milestone,
      timestamp: new Date().toISOString(),
    });
  };

  const trackSubscription = (subscriptionData: {
    plan: string;
    value: number;
    currency: string;
  }) => {
    if (!hasConsent) return;

    const { plan, value, currency } = subscriptionData;

    track("subscription_started", {
      plan,
      value,
      currency,
      timestamp: new Date().toISOString(),
    });

    facebookPixelUtils.trackSubscribe({
      value,
      currency,
      predicted_ltv: value * 12, // Assume yearly LTV
    });
  };

  const trackFormSubmit = (formName: string, formData?: Record<string, any>) => {
    if (!hasConsent) return;

    track("form_submitted", {
      form_name: formName,
      ...formData,
      timestamp: new Date().toISOString(),
    });

    if (formName === "contact_form" || formName === "signup_form") {
      facebookPixelUtils.trackLead({
        content_name: formName,
      });
    }
  };

  const trackFormError = (formName: string, errorType: string, fieldName?: string) => {
    if (!hasConsent) return;

    track("form_error", {
      form_name: formName,
      error_type: errorType,
      field_name: fieldName,
      timestamp: new Date().toISOString(),
    });
  };

  const contextValue: AnalyticsContextType = {
    hasConsent,
    grantConsent,
    revokeConsent,
    identifyUser,
    track,
    trackPageView,
    trackPurchase,
    trackGoalCreated,
    trackGoalCompleted,
    trackGoalProgress,
    trackSubscription,
    trackFormSubmit,
    trackFormError,
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
      {hasConsent && (
        <>
          <GoogleAnalytics />
          <MicrosoftClarity />
          <Hotjar />
          <PostHog />
          <Mixpanel />
          <FacebookPixel />
        </>
      )}
    </AnalyticsContext.Provider>
  );
};

// Hook to use analytics
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
};

// HOC for page tracking
export const withPageTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageName?: string
) => {
  return function PageTrackingComponent(props: P) {
    const analytics = useAnalytics();

    useEffect(() => {
      analytics.trackPageView(pageName);
    }, [analytics]);

    return <WrappedComponent {...props} />;
  };
};
