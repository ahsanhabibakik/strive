"use client";

import { useEffect } from "react";
import Script from "next/script";
import { clientEnv } from "@/lib/config/env";

export const MicrosoftClarity = () => {
  const clarityId = clientEnv.CLARITY_ID || process.env.NEXT_PUBLIC_CLARITY_ID;
  const enableClarity = process.env.NEXT_PUBLIC_ENABLE_CLARITY === "true";

  useEffect(() => {
    if (!clarityId || !enableClarity) {
      console.warn("Microsoft Clarity: Missing NEXT_PUBLIC_CLARITY_ID or disabled");
      return;
    }

    // Initialize Clarity if not already loaded
    if (typeof window !== "undefined" && !window.clarity) {
      (function (c: any, l: Document, a: string, r: string, i: string, t: any, y: any) {
        c[a] =
          c[a] ||
          function (...args: any[]) {
            (c[a].q = c[a].q || []).push(args);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", clarityId);
    }
  }, [clarityId, enableClarity]);

  if (!clarityId || !enableClarity) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  );
};

// Clarity utility functions for custom events
export const clarityUtils = {
  // Track custom events
  event: (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("event", eventName, data);
    }
  },

  // Set custom tags for user segmentation
  setTag: (key: string, value: string) => {
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("set", key, value);
    }
  },

  // Identify users
  identify: (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("identify", userId, sessionId, pageId, friendlyName);
    }
  },

  // Get session URL for debugging
  getSessionUrl: (): string | null => {
    if (typeof window !== "undefined" && window.clarity) {
      return window.clarity("get") || null;
    }
    return null;
  },
};

// TypeScript declaration for Clarity
declare global {
  interface Window {
    clarity?: {
      (action: "event", name: string, data?: Record<string, any>): void;
      (action: "set", key: string, value: string): void;
      (
        action: "identify",
        userId: string,
        sessionId?: string,
        pageId?: string,
        friendlyName?: string
      ): void;
      (action: "get"): string;
      q?: any[];
    };
  }
}
