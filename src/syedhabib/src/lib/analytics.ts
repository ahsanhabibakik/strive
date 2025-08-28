// Analytics utilities for tracking user interactions
'use client';

// Microsoft Clarity tracking
interface ClarityWindow extends Window {
  clarity?: {
    (method: string, ...args: any[]): void;
    q?: any[];
  };
}

declare const window: ClarityWindow;

// Check if Clarity is available
const isClarityAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.clarity;
};

export const analytics = {
  // Track custom events in Clarity
  track: (eventName: string, customData?: Record<string, any>) => {
    if (isClarityAvailable()) {
      window.clarity!('set', eventName, customData);
    }
  },

  // Track user identification (useful for user journey analysis)
  identify: (userId: string, userProperties?: Record<string, any>) => {
    if (isClarityAvailable()) {
      window.clarity!('identify', userId, userProperties);
    }
  },

  // Track page views (automatic, but can be triggered manually for SPA)
  pageView: (pageName?: string) => {
    if (isClarityAvailable() && pageName) {
      window.clarity!('set', 'page', pageName);
    }
  },

  // Upgrade/Upgrade session (mark important sessions)
  upgradeSession: () => {
    if (isClarityAvailable()) {
      window.clarity!('upgrade');
    }
  },

  // Add custom tags to sessions
  addTag: (tag: string) => {
    if (isClarityAvailable()) {
      window.clarity!('set', 'tag', tag);
    }
  },

  // Predefined events for common portfolio interactions
  events: {
    // Contact form interactions
    contactFormStart: () => analytics.track('contact_form_started'),
    contactFormSubmit: () => analytics.track('contact_form_submitted'),
    
    // Project interactions
    projectView: (projectName: string) => analytics.track('project_viewed', { project: projectName }),
    projectClick: (projectName: string) => analytics.track('project_clicked', { project: projectName }),
    
    // Blog interactions
    blogPostView: (postTitle: string) => analytics.track('blog_post_viewed', { post: postTitle }),
    blogPostRead: (postTitle: string, readTime: number) => analytics.track('blog_post_read', { 
      post: postTitle, 
      read_time: readTime 
    }),
    
    // Service inquiries
    serviceInquiry: (serviceName: string) => analytics.track('service_inquiry', { service: serviceName }),
    
    // Downloads/Resource access
    resourceDownload: (resourceName: string) => analytics.track('resource_downloaded', { resource: resourceName }),
    
    // Navigation tracking
    navigationClick: (destination: string) => analytics.track('navigation_click', { destination }),
    
    // CTA interactions
    ctaClick: (ctaName: string, location: string) => analytics.track('cta_clicked', { 
      cta: ctaName, 
      location 
    }),
  }
};

// Export individual tracking functions for convenience
export const {
  track,
  identify,
  pageView,
  events: trackingEvents
} = analytics;
