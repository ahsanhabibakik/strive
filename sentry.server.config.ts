// This file configures the initialization of Sentry on the server side.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  environment: process.env.NODE_ENV,

  // Configure error filtering for server-side
  beforeSend(event, hint) {
    const error = hint.originalException as Error | undefined;
    
    // Filter out known non-critical server errors
    if (error && error.message) {
      // Ignore expected database connection errors during startup
      if (error.message.includes('ECONNREFUSED') && error.message.includes('MongoDB')) {
        return null;
      }
      
      // Ignore expected webhook validation errors (they're handled)
      if (error.message.includes('Webhook signature verification failed')) {
        return null;
      }
      
      // Ignore rate limiting errors (they're expected)
      if (error.message.includes('Too Many Requests')) {
        return null;
      }
    }
    
    return event;
  },

  // Additional configuration for server-side
  integrations: [
    // Add any server-specific integrations here
  ],
});