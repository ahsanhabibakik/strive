'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);
    
    // Initialize analytics if accepted
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    setPreferences(onlyNecessary);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary));
    setShowBanner(false);
    
    // Deny analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  const savePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'customized');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
    
    // Update analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
      });
    }
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Necessary cookies can't be disabled
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="mx-auto max-w-4xl bg-white shadow-2xl border-t-4 border-t-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Cookie className="w-6 h-6 text-indigo-600" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to provide you with a personalized browsing experience, serve relevant ads, 
                    analyze site traffic, and understand how you interact with our site. You can customize your 
                    cookie preferences or learn more in our{' '}
                    <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 underline">
                      privacy policy
                    </Link>
                    {' '}and{' '}
                    <Link href="/cookies" className="text-indigo-600 hover:text-indigo-700 underline">
                      cookie policy
                    </Link>
                    .
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={acceptAll} className="flex-1 sm:flex-none">
                    Accept All Cookies
                  </Button>
                  <Button onClick={rejectAll} variant="outline" className="flex-1 sm:flex-none">
                    Reject All
                  </Button>
                  <Button 
                    onClick={() => setShowPreferences(true)} 
                    variant="ghost" 
                    className="flex-1 sm:flex-none"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
              
              <button
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose which cookies you want to accept. You can change these settings at any time.
                  </p>
                </div>
                
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-gray-900 mb-1">Necessary Cookies</h3>
                    <p className="text-sm text-gray-600">
                      These cookies are essential for the website to function properly. They enable core functionality 
                      such as security, network management, and accessibility.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="sr-only"
                      />
                      <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center">
                        <div className="w-5 h-5 bg-white rounded-full ml-1 shadow-sm"></div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Always On</span>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-gray-900 mb-1">Analytics Cookies</h3>
                    <p className="text-sm text-gray-600">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="relative inline-block">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => updatePreference('analytics', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.analytics ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          preferences.analytics ? 'translate-x-6 ml-1' : 'ml-1'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-gray-900 mb-1">Marketing Cookies</h3>
                    <p className="text-sm text-gray-600">
                      These cookies track your online activity to help advertisers deliver more relevant 
                      advertising or to limit how many times you see an ad.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="relative inline-block">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => updatePreference('marketing', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.marketing ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          preferences.marketing ? 'translate-x-6 ml-1' : 'ml-1'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Preference Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-gray-900 mb-1">Preference Cookies</h3>
                    <p className="text-sm text-gray-600">
                      These cookies remember your settings and preferences to provide a more personalized 
                      experience on future visits.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="relative inline-block">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => updatePreference('preferences', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        preferences.preferences ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          preferences.preferences ? 'translate-x-6 ml-1' : 'ml-1'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <Button onClick={savePreferences} className="flex-1">
                  Save Preferences
                </Button>
                <Button onClick={acceptAll} variant="outline" className="flex-1">
                  Accept All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook to check if specific cookie types are allowed
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  return preferences;
}