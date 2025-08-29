'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Types for Google Analytics events
interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface GAConversion {
  send_to: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

interface GAPageView {
  page_title: string;
  page_location: string;
  page_path: string;
}

// Google Analytics component
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams ? `?${searchParams}` : '');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Google Analytics functions
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag(...args);
  }
};

// Track page views
export const trackPageView = (data: GAPageView) => {
  if (!GA_MEASUREMENT_ID) return;
  
  gtag('config', GA_MEASUREMENT_ID, {
    page_title: data.page_title,
    page_location: data.page_location,
    page_path: data.page_path,
  });
};

// Track custom events
export const trackEvent = (data: GAEvent) => {
  if (!GA_MEASUREMENT_ID) return;
  
  gtag('event', data.action, {
    event_category: data.category,
    event_label: data.label,
    value: data.value,
  });
};

// Track conversions
export const trackConversion = (data: GAConversion) => {
  if (!GA_MEASUREMENT_ID) return;
  
  gtag('event', 'conversion', {
    send_to: data.send_to,
    value: data.value,
    currency: data.currency,
    transaction_id: data.transaction_id,
  });
};

// Predefined event trackers for common actions
export const Analytics = {
  // User authentication events
  trackSignUp: (method: 'google' | 'email') => {
    trackEvent({
      action: 'sign_up',
      category: 'user',
      label: method,
    });
  },

  trackSignIn: (method: 'google' | 'email') => {
    trackEvent({
      action: 'login',
      category: 'user',
      label: method,
    });
  },

  trackSignOut: () => {
    trackEvent({
      action: 'logout',
      category: 'user',
    });
  },

  // Subscription events
  trackSubscriptionStart: (planName: string, value: number) => {
    trackEvent({
      action: 'begin_checkout',
      category: 'subscription',
      label: planName,
      value: value,
    });
  },

  trackSubscriptionComplete: (planName: string, value: number, transactionId: string) => {
    trackEvent({
      action: 'purchase',
      category: 'subscription',
      label: planName,
      value: value,
    });
    
    // Also track as conversion if you have conversion tracking set up
    trackConversion({
      send_to: `${GA_MEASUREMENT_ID}/subscription`,
      value: value,
      currency: 'USD',
      transaction_id: transactionId,
    });
  },

  trackSubscriptionCancel: (planName: string) => {
    trackEvent({
      action: 'cancel_subscription',
      category: 'subscription',
      label: planName,
    });
  },

  // Content engagement events
  trackNewsletterSignup: () => {
    trackEvent({
      action: 'newsletter_signup',
      category: 'engagement',
    });
  },

  trackContactForm: () => {
    trackEvent({
      action: 'contact_form_submit',
      category: 'engagement',
    });
  },

  trackBlogView: (articleTitle: string) => {
    trackEvent({
      action: 'view_blog_post',
      category: 'content',
      label: articleTitle,
    });
  },

  // Feature usage events
  trackFeatureUse: (featureName: string) => {
    trackEvent({
      action: 'use_feature',
      category: 'features',
      label: featureName,
    });
  },

  trackAPIKeyGenerated: () => {
    trackEvent({
      action: 'api_key_generated',
      category: 'features',
    });
  },

  // Dashboard events
  trackDashboardView: (section: string) => {
    trackEvent({
      action: 'view_dashboard_section',
      category: 'dashboard',
      label: section,
    });
  },

  // Error tracking
  trackError: (errorType: string, errorMessage?: string) => {
    trackEvent({
      action: 'error',
      category: 'errors',
      label: `${errorType}: ${errorMessage || 'Unknown error'}`,
    });
  },

  // Search events
  trackSearch: (searchTerm: string, resultsCount?: number) => {
    trackEvent({
      action: 'search',
      category: 'site_search',
      label: searchTerm,
      value: resultsCount,
    });
  },
};

// Hook for tracking page views in app directory
export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams ? `?${searchParams}` : '');
    
    trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: url,
    });
  }, [pathname, searchParams]);
}