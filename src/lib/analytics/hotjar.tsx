"use client";

import { useEffect } from "react";
import Script from "next/script";

export const Hotjar = () => {
  const hotjarId = process.env.NEXT_PUBLIC_HOTJAR_ID;
  const hotjarVersion = process.env.NEXT_PUBLIC_HOTJAR_VERSION || "6";

  useEffect(() => {
    if (!hotjarId) {
      console.warn("Hotjar: Missing NEXT_PUBLIC_HOTJAR_ID");
      return;
    }

    // Ensure a valid numeric Hotjar ID
    const hjid = parseInt(hotjarId, 10);
    if (isNaN(hjid)) {
      console.warn("Hotjar: NEXT_PUBLIC_HOTJAR_ID must be a number");
      return;
    }

    // Check if Hotjar is already loaded
    if (typeof window !== "undefined" && window.hj) {
      return;
    }

    // Initialize Hotjar
    (function (
      h: any,
      o: Document,
      t: string,
      j: string,
      a?: HTMLScriptElement,
      r?: HTMLScriptElement
    ) {
      h.hj =
        h.hj ||
        function (...args: any[]) {
          (h.hj.q = h.hj.q || []).push(args);
        };
      h._hjSettings = { hjid: hjid, hjsv: parseInt(hotjarVersion, 10) };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = `https://static.hotjar.com/c/hotjar-${hjid}.js?sv=${hotjarVersion}`;
      a.appendChild(r);
    })(window, document);
  }, [hotjarId, hotjarVersion]);

  if (!hotjarId) {
    return null;
  }

  const hjid = parseInt(hotjarId, 10);
  if (isNaN(hjid)) {
    return null;
  }

  return (
    <Script
      id="hotjar"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hjid},hjsv:${hotjarVersion}};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      }}
    />
  );
};

// Hotjar utility functions
export const hotjarUtils = {
  // Trigger events
  event: (eventName: string) => {
    if (typeof window !== "undefined" && window.hj) {
      window.hj("event", eventName);
    }
  },

  // Track state changes (for SPA)
  stateChange: (relativePath: string) => {
    if (typeof window !== "undefined" && window.hj) {
      window.hj("stateChange", relativePath);
    }
  },

  // Identify users
  identify: (userId: string, attributes?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.hj) {
      window.hj("identify", userId, attributes);
    }
  },

  // Tag recordings
  tagRecording: (tags: string[]) => {
    if (typeof window !== "undefined" && window.hj) {
      window.hj("tagRecording", tags);
    }
  },

  // Trigger surveys
  trigger: (surveyId: string) => {
    if (typeof window !== "undefined" && window.hj) {
      window.hj("trigger", surveyId);
    }
  },
};

// TypeScript declaration for Hotjar
declare global {
  interface Window {
    hj?: {
      (action: "event", eventName: string): void;
      (action: "stateChange", path: string): void;
      (action: "identify", userId: string, attributes?: Record<string, any>): void;
      (action: "tagRecording", tags: string[]): void;
      (action: "trigger", surveyId: string): void;
      q?: any[];
    };
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  }
}
