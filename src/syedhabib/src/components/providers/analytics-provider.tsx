"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { ConsentManager } from "@/components/analytics/ConsentManager";
import { Hotjar } from "@/components/analytics/Hotjar";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { Plausible } from "@/components/analytics/Plausible";
import { TawkChat } from "@/components/chat/TawkChat";
// Import types
import "@/components/providers/analytics-types";

interface AnalyticsContextType {
  hasConsent: boolean;
  isLoaded: boolean;
  trackEvent: (eventName: string, eventData?: Record<string, unknown>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  hasConsent: false,
  isLoaded: false,
  trackEvent: () => {},
});

export const useAnalytics = () => useContext(AnalyticsContext);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConsent = localStorage.getItem("cookie-consent");
      if (storedConsent === "accepted") {
        setHasConsent(true);
      }
      setIsLoaded(true);
    }
  }, []);

  const handleAcceptConsent = () => {
    setHasConsent(true);
    localStorage.setItem("cookie-consent", "accepted");
  };

  const handleDeclineConsent = () => {
    setHasConsent(false);
    localStorage.setItem("cookie-consent", "declined");
  };

  // Unified event tracking function
  const trackEvent = (
    eventName: string,
    eventData?: Record<string, unknown>
  ) => {
    if (!hasConsent) return;

    // Track in Google Tag Manager
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventData,
      });
    }

    // Track in Hotjar
    if (typeof window !== "undefined" && window.hj) {
      window.hj("event", eventName, eventData);
    }

    // Track in Microsoft Clarity
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("event", eventName, eventData);
    }

    // Log for debugging
    console.log(`[Analytics] Event: ${eventName}`, eventData);
  };

  return (
    <AnalyticsContext.Provider value={{ hasConsent, isLoaded, trackEvent }}>
      {children}

      {/* Always load chat widget as it's considered essential */}
      <TawkChat />

      {/* Only load analytics if consent is given */}
      {hasConsent && (
        <>
          <GoogleTagManager />
          <Hotjar />
          <MicrosoftClarity />
          <Plausible />
        </>
      )}

      {/* Show consent manager if needed */}
      <ConsentManager
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />
    </AnalyticsContext.Provider>
  );
}
