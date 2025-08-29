"use client";

import { useEffect } from "react";
import Script from "next/script";

export const FacebookPixel = () => {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) {
      console.warn("Facebook Pixel: Missing NEXT_PUBLIC_FACEBOOK_PIXEL_ID");
      return;
    }

    // Initialize Facebook Pixel
    if (typeof window !== "undefined" && !window.fbq) {
      (function (f: any, b: Document, e: string, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function (...args: any[]) {
          n.callMethod ? n.callMethod(...args) : n.queue.push(args);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode?.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

      // Initialize with pixel ID
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
  }, [pixelId]);

  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Facebook Pixel"
        />
      </noscript>
    </>
  );
};

// Facebook Pixel utility functions
export const facebookPixelUtils = {
  // Track events
  track: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", eventName, parameters);
    }
  },

  // Track custom events
  trackCustom: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", eventName, parameters);
    }
  },

  // Standard events
  trackPageView: () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  },

  trackViewContent: (parameters?: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
  }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "ViewContent", parameters);
    }
  },

  trackSearch: (searchString: string, parameters?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Search", { search_string: searchString, ...parameters });
    }
  },

  trackAddToCart: (parameters?: {
    content_name?: string;
    value?: number;
    currency?: string;
    content_type?: string;
    content_ids?: string[];
  }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "AddToCart", parameters);
    }
  },

  trackInitiateCheckout: (parameters?: {
    value?: number;
    currency?: string;
    num_items?: number;
  }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout", parameters);
    }
  },

  trackPurchase: (parameters?: {
    value: number;
    currency: string;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
  }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", parameters);
    }
  },

  trackLead: (parameters?: { content_name?: string; value?: number; currency?: string }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", parameters);
    }
  },

  trackCompleteRegistration: (parameters?: {
    content_name?: string;
    value?: number;
    currency?: string;
    status?: string;
  }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "CompleteRegistration", parameters);
    }
  },

  trackContact: (parameters?: { content_name?: string }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact", parameters);
    }
  },

  trackSubscribe: (parameters?: { value?: number; currency?: string; predicted_ltv?: number }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Subscribe", parameters);
    }
  },

  // Advanced matching (for better conversion tracking)
  setAdvancedMatching: (userData: {
    em?: string; // email
    ph?: string; // phone
    fn?: string; // first name
    ln?: string; // last name
    ct?: string; // city
    st?: string; // state
    zp?: string; // zip
    country?: string;
  }) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("init", process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID, userData);
    }
  },
};

// TypeScript declaration for Facebook Pixel
declare global {
  interface Window {
    fbq?: {
      (action: "init", pixelId: string, userData?: Record<string, any>): void;
      (action: "track", eventName: string, parameters?: Record<string, any>): void;
      (action: "trackCustom", eventName: string, parameters?: Record<string, any>): void;
      callMethod?: {
        apply: (context: any, args: any[]) => void;
      };
      queue?: any[];
      loaded?: boolean;
      version?: string;
      push?: any;
    };
    _fbq?: any;
  }
}
