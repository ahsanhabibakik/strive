"use client";

import { useEffect } from "react";
import Script from "next/script";

export const Mixpanel = () => {
  const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  useEffect(() => {
    if (!mixpanelToken) {
      console.warn("Mixpanel: Missing NEXT_PUBLIC_MIXPANEL_TOKEN");
      return;
    }

    // Initialize Mixpanel
    if (typeof window !== "undefined" && !window.mixpanel) {
      (function (f: any, b: Document) {
        if (!b.__SV) {
          let e: any, g: any, i: any, h: any;
          window.mixpanel = f;
          f._i = [];
          f.init = function (e: string, g?: any, i?: string) {
            function h(a: any, b: string) {
              const c = b.split(".");
              2 == c.length && ((a = a[c[0]]), (b = c[1]));
              a[b] = function (...args: any[]) {
                a.push([b].concat(Array.prototype.slice.call(args, 0)));
              };
            }
            let a = f;
            "undefined" !== typeof i ? (a = f[i] = []) : (i = "mixpanel");
            a.people = a.people || [];
            a.toString = function (a: any) {
              let b = "mixpanel";
              "mixpanel" !== i && (b += "." + i);
              a || (b += " (stub)");
              return b;
            };
            a.people.toString = function () {
              return a.toString(1) + ".people (stub)";
            };
            const c =
              "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(
                " "
              );
            for (h = 0; h < c.length; h++) h(a, c[h]);
            const k = b.createElement("script");
            k.type = "text/javascript";
            k.async = !0;
            k.src =
              "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL
                ? MIXPANEL_CUSTOM_LIB_URL
                : "file:" === b.location.protocol &&
                    "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)
                  ? "https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js"
                  : "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";
            const l = b.getElementsByTagName("script")[0];
            l.parentNode?.insertBefore(k, l);
            f._i.push([e, g, i]);
          };
          f.__SV = 1.2;

          // Initialize with token
          f.init(mixpanelToken, {
            debug: process.env.NODE_ENV === "development",
            track_pageview: true,
            persistence: "localStorage",
            ip: false, // Privacy compliance
            property_blacklist: ["$current_url", "$initial_referrer", "$referrer"],
          });
        }
      })(window.mixpanel || [], document);
    }
  }, [mixpanelToken]);

  if (!mixpanelToken) {
    return null;
  }

  return (
    <Script
      id="mixpanel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=f;f._i=[];f.init=function(e,g,i){function h(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var a=f;"undefined"!==typeof i?a=f[i]=[]:i="mixpanel";a.people=a.people||[];a.toString=function(a){var b="mixpanel";"mixpanel"!==i&&(b+="."+i);a||(b+=" (stub)");return b};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)h(a,i[h]);var k=b.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===b.location.protocol&&"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?  "https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";i=b.getElementsByTagName("script")[0];i.parentNode.insertBefore(k,i);f._i.push([e,g])};f.__SV=1.2;
          f.init("${mixpanelToken}", {
            debug: ${process.env.NODE_ENV === "development"},
            track_pageview: true,
            persistence: 'localStorage',
            ip: false,
            property_blacklist: ['$current_url', '$initial_referrer', '$referrer']
          });}})(window.mixpanel||[],document);
        `,
      }}
    />
  );
};

// Mixpanel utility functions
export const mixpanelUtils = {
  // Track events
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track(eventName, properties);
    }
  },

  // Track page views
  trackPageView: (pageName?: string, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track_pageview({
        page: pageName || window.location.pathname,
        ...properties,
      });
    }
  },

  // Identify users
  identify: (distinctId: string) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.identify(distinctId);
    }
  },

  // Set user properties
  setUserProperties: (properties: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.people.set(properties);
    }
  },

  // Set user properties once
  setUserPropertiesOnce: (properties: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.people.set_once(properties);
    }
  },

  // Increment user properties
  incrementUserProperty: (property: string, value?: number) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.people.increment(property, value || 1);
    }
  },

  // Set super properties (sent with every event)
  setSuperProperties: (properties: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.register(properties);
    }
  },

  // Set super properties once
  setSuperPropertiesOnce: (properties: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.register_once(properties);
    }
  },

  // Track revenue
  trackCharge: (amount: number, properties?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.people.track_charge(amount, properties);
    }
  },

  // Create alias
  alias: (alias: string, distinctId?: string) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.alias(alias, distinctId);
    }
  },

  // Reset user
  reset: () => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.reset();
    }
  },

  // Opt out
  optOut: () => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.opt_out_tracking();
    }
  },

  // Opt in
  optIn: () => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.opt_in_tracking();
    }
  },
};

// TypeScript declaration for Mixpanel
declare global {
  interface Window {
    mixpanel?: {
      track: (event: string, properties?: Record<string, any>) => void;
      track_pageview: (properties?: Record<string, any>) => void;
      identify: (distinctId: string) => void;
      people: {
        set: (properties: Record<string, any>) => void;
        set_once: (properties: Record<string, any>) => void;
        increment: (property: string, value?: number) => void;
        track_charge: (amount: number, properties?: Record<string, any>) => void;
      };
      register: (properties: Record<string, any>) => void;
      register_once: (properties: Record<string, any>) => void;
      alias: (alias: string, distinctId?: string) => void;
      reset: () => void;
      opt_out_tracking: () => void;
      opt_in_tracking: () => void;
      _i?: any[];
      __SV?: number;
      init?: (token: string, config?: Record<string, any>) => void;
      push?: (args: any[]) => void;
    };
  }
}
