"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { handleCookieConsent, hasAnalyticsConsent } from "@/lib/analytics";
import { X, Cookie } from "lucide-react";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnalyticsConsent() && localStorage.getItem("cookie_consent") === null) {
        setShowConsent(true);
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    handleCookieConsent(true);
    setIsVisible(false);
    setTimeout(() => setShowConsent(false), 300);
  };

  const declineCookies = () => {
    handleCookieConsent(false);
    setIsVisible(false);
    setTimeout(() => setShowConsent(false), 300);
  };

  if (!showConsent) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-6 h-6 text-yellow-600 mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-2">Cookie Consent</h3>
              <p className="text-xs text-gray-600 mb-3">
                We use cookies to improve your experience and analyze site usage. Your privacy is
                important to us.
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={acceptCookies} className="flex-1">
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={declineCookies} className="flex-1">
                  Decline
                </Button>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={declineCookies} className="p-1 h-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
