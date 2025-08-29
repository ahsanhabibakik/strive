"use client";

import { useEffect } from "react";
import Script from "next/script";

export const PostHog = () => {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  useEffect(() => {
    if (!posthogKey) {
      console.warn("PostHog: Missing NEXT_PUBLIC_POSTHOG_KEY");
      return;
    }

    // Initialize PostHog
    if (typeof window !== "undefined" && !window.posthog) {
      (function (t: any, e: Document, d: any) {
        const r = e.createElement("script");
        r.type = "text/javascript";
        r.async = true;
        r.src = posthogHost + "/static/array.js";

        const n = e.getElementsByTagName("script")[0];
        n.parentNode?.insertBefore(r, n);

        t.posthog = d;

        const i = [
          "init",
          "identify",
          "track",
          "track_pageview",
          "track_links",
          "track_forms",
          "capture",
          "group",
          "time_event",
          "alias",
          "set",
          "set_once",
          "register",
          "register_once",
          "unregister",
          "opt_out_tracking",
          "has_opted_out_tracking",
          "opt_in_tracking",
          "reset",
          "isFeatureEnabled",
          "getFeatureFlag",
          "onFeatureFlags",
          "people.set",
          "people.set_once",
          "people.unset",
          "people.increment",
          "people.append",
          "people.union",
          "people.track_charge",
          "people.clear_charges",
        ];

        i.forEach((method: string) => {
          d[method] = function (...args: any[]) {
            d.__SV = d.__SV || { v: "1.0" };
            const queue = (d.__SV.l = d.__SV.l || []);
            queue.push([method, ...args]);
          };
        });
      })(window, document, window.posthog || []);

      // Initialize with configuration
      window.posthog.init(posthogKey, {
        api_host: posthogHost,
        // Privacy settings
        respect_dnt: true,
        opt_out_tracking_by_default: false,
        // Performance
        loaded: function (posthog: any) {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
        // Capture settings
        capture_pageview: true,
        capture_pageleave: true,
        // Feature flags
        bootstrap: {},
      });
    }
  }, [posthogKey, posthogHost]);

  if (!posthogKey) {
    return null;
  }

  return (
    <Script
      id="posthog"
      strategy="afterInteractive"
      src={`${posthogHost}/static/array.js`}
      onLoad={() => {
        if (window.posthog) {
          window.posthog.init(posthogKey, {
            api_host: posthogHost,
            respect_dnt: true,
            capture_pageview: true,
            capture_pageleave: true,
            loaded: (posthog: any) => {
              if (process.env.NODE_ENV === "development") posthog.debug();
            },
          });
        }
      }}
    />
  );
};

// PostHog utility functions
export const posthogUtils = {
  // Track events
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture(eventName, properties);
    }
  },

  // Identify users
  identify: (distinctId: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.identify(distinctId, properties);
    }
  },

  // Group users
  group: (groupType: string, groupKey: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.group(groupType, groupKey, properties);
    }
  },

  // Set user properties
  setPersonProperties: (properties: Record<string, any>) => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.people.set(properties);
    }
  },

  // Feature flags
  isFeatureEnabled: (flag: string): boolean => {
    if (typeof window !== "undefined" && window.posthog) {
      return window.posthog.isFeatureEnabled(flag);
    }
    return false;
  },

  // Get feature flag value
  getFeatureFlag: (flag: string): any => {
    if (typeof window !== "undefined" && window.posthog) {
      return window.posthog.getFeatureFlag(flag);
    }
    return null;
  },

  // Reset user
  reset: () => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.reset();
    }
  },

  // Opt out
  optOut: () => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.opt_out_tracking();
    }
  },

  // Opt in
  optIn: () => {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.opt_in_tracking();
    }
  },
};

// TypeScript declaration for PostHog
declare global {
  interface Window {
    posthog?: {
      init: (token: string, config: Record<string, any>) => void;
      capture: (event: string, properties?: Record<string, any>) => void;
      identify: (distinctId: string, properties?: Record<string, any>) => void;
      group: (groupType: string, groupKey: string, properties?: Record<string, any>) => void;
      people: {
        set: (properties: Record<string, any>) => void;
      };
      isFeatureEnabled: (flag: string) => boolean;
      getFeatureFlag: (flag: string) => any;
      reset: () => void;
      opt_out_tracking: () => void;
      opt_in_tracking: () => void;
      debug: () => void;
      __SV?: any;
    };
  }
}
