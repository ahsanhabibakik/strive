// Analytics exports
export { GoogleAnalytics } from "./google-analytics";
export { MicrosoftClarity, clarityUtils } from "./microsoft-clarity";
export { Hotjar, hotjarUtils } from "./hotjar";
export { PostHog, posthogUtils } from "./posthog";
export { Mixpanel, mixpanelUtils } from "./mixpanel";
export { FacebookPixel, facebookPixelUtils } from "./facebook-pixel";
export { AnalyticsProvider, useAnalytics, withPageTracking } from "./provider";

// Unified analytics utilities
export const analytics = {
  // Event tracking shortcuts
  trackSignUp: (method: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      // Track across multiple platforms
      const eventData = { method, ...properties };

      // PostHog
      if (window.posthog) {
        window.posthog.capture("user_signed_up", eventData);
      }

      // Mixpanel
      if (window.mixpanel) {
        window.mixpanel.track("Sign Up", eventData);
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq("track", "CompleteRegistration", { content_name: "User Registration" });
      }

      // Clarity
      if (window.clarity) {
        window.clarity("event", "sign_up", eventData);
      }

      // Hotjar
      if (window.hj) {
        window.hj("event", "sign_up");
      }
    }
  },

  trackSignIn: (method: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      const eventData = { method, ...properties };

      if (window.posthog) {
        window.posthog.capture("user_signed_in", eventData);
      }

      if (window.mixpanel) {
        window.mixpanel.track("Sign In", eventData);
      }

      if (window.clarity) {
        window.clarity("event", "sign_in", eventData);
      }
    }
  },

  trackGoalCreated: (goalType: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined") {
      const eventData = { goal_type: goalType, ...properties };

      if (window.posthog) {
        window.posthog.capture("goal_created", eventData);
      }

      if (window.mixpanel) {
        window.mixpanel.track("Goal Created", eventData);
      }

      if (window.fbq) {
        window.fbq("track", "CompleteRegistration", { content_name: "Goal Created" });
      }

      if (window.clarity) {
        window.clarity("event", "goal_created", eventData);
        window.clarity("set", "user_type", "goal_creator");
      }

      if (window.hj) {
        window.hj("event", "goal_created");
        window.hj("tagRecording", ["goal-creator"]);
      }
    }
  },

  trackSubscription: (plan: string, value: number, currency: string) => {
    if (typeof window !== "undefined") {
      const eventData = { plan, value, currency };

      if (window.posthog) {
        window.posthog.capture("subscription_started", eventData);
      }

      if (window.mixpanel) {
        window.mixpanel.track("Subscription Started", eventData);
        window.mixpanel.people.track_charge(value, { plan, currency });
      }

      if (window.fbq) {
        window.fbq("track", "Subscribe", { value, currency });
      }

      if (window.clarity) {
        window.clarity("event", "subscription_started", eventData);
        window.clarity("set", "subscription_tier", plan);
      }
    }
  },

  trackPurchase: (transactionId: string, value: number, currency: string, items?: any[]) => {
    if (typeof window !== "undefined") {
      const eventData = { transaction_id: transactionId, value, currency, items };

      if (window.posthog) {
        window.posthog.capture("purchase", eventData);
      }

      if (window.mixpanel) {
        window.mixpanel.track("Purchase", eventData);
        window.mixpanel.people.track_charge(value, { transaction_id: transactionId, currency });
      }

      if (window.fbq) {
        window.fbq("track", "Purchase", { value, currency });
      }

      if (window.clarity) {
        window.clarity("event", "purchase", eventData);
      }
    }
  },
};

// Analytics configuration
export const analyticsConfig = {
  // Privacy settings
  respectDNT: true,
  cookieConsent: true,

  // Performance settings
  loadOnInteraction: true,
  defer: true,

  // Debug mode
  debug: process.env.NODE_ENV === "development",

  // Enabled platforms (can be controlled via environment)
  platforms: {
    googleAnalytics: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    clarity: !!process.env.NEXT_PUBLIC_CLARITY_ID,
    hotjar: !!process.env.NEXT_PUBLIC_HOTJAR_ID,
    posthog: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    mixpanel: !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    facebookPixel: !!process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
  },
};
