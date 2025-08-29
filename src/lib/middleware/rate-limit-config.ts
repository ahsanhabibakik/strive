import { NextRequest } from 'next/server';
import { RateLimitOptions } from './rate-limit';

/**
 * Rate limit configuration for different endpoint patterns
 */
export interface RateLimitConfig {
  pattern: string | RegExp;
  options: RateLimitOptions;
  description: string;
  authRequired?: boolean;
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMIT_CONFIGS: RateLimitConfig[] = [
  // Authentication endpoints - strict limits
  {
    pattern: /^\/api\/auth\/(signin|signup|callback)/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 5,
      message: 'Too many authentication attempts, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
    },
    description: 'Authentication endpoints',
    authRequired: false,
  },
  
  // Password reset endpoints
  {
    pattern: /^\/api\/auth\/(forgot-password|reset-password)/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 3,
      message: 'Too many password reset attempts, please try again later',
      standardHeaders: true,
    },
    description: 'Password reset endpoints',
    authRequired: false,
  },

  // Email verification endpoints
  {
    pattern: /^\/api\/auth\/(verify-email|resend-verification)/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 3,
      message: 'Too many verification attempts, please try again later',
      standardHeaders: true,
    },
    description: 'Email verification endpoints',
    authRequired: false,
  },

  // File upload endpoints - very strict
  {
    pattern: /^\/api\/(upload|files)/,
    options: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
      message: 'Upload limit exceeded, please wait before uploading more files',
      standardHeaders: true,
      keyGenerator: (req: NextRequest) => {
        // Use user ID if authenticated, otherwise IP
        const userId = (req as any).user?.id;
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        return `rate_limit:upload:${userId || ip}`;
      },
    },
    description: 'File upload endpoints',
    authRequired: true,
  },

  // Search endpoints
  {
    pattern: /^\/api\/(search|query)/,
    options: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 50,
      message: 'Search rate limit exceeded, please wait before searching again',
      standardHeaders: true,
    },
    description: 'Search endpoints',
    authRequired: false,
  },

  // API key management
  {
    pattern: /^\/api\/api-keys/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 10,
      message: 'API key management rate limit exceeded',
      standardHeaders: true,
    },
    description: 'API key management',
    authRequired: true,
  },

  // Admin endpoints - moderate limits
  {
    pattern: /^\/api\/admin/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 30,
      message: 'Admin API rate limit exceeded',
      standardHeaders: true,
    },
    description: 'Admin endpoints',
    authRequired: true,
  },

  // Payment/billing endpoints
  {
    pattern: /^\/api\/(payments|billing|subscriptions)/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 15,
      message: 'Payment API rate limit exceeded',
      standardHeaders: true,
    },
    description: 'Payment endpoints',
    authRequired: true,
  },

  // User profile endpoints
  {
    pattern: /^\/api\/(users|profile)/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 30,
      message: 'User API rate limit exceeded',
      standardHeaders: true,
    },
    description: 'User profile endpoints',
    authRequired: true,
  },

  // Goals and habits endpoints
  {
    pattern: /^\/api\/(goals|habits)/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 60,
      message: 'Goals/Habits API rate limit exceeded',
      standardHeaders: true,
    },
    description: 'Goals and habits endpoints',
    authRequired: true,
  },

  // Contact/support endpoints
  {
    pattern: /^\/api\/(contact|support)/,
    options: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
      message: 'Contact form submission limit exceeded',
      standardHeaders: true,
    },
    description: 'Contact and support endpoints',
    authRequired: false,
  },

  // Health check - very lenient
  {
    pattern: /^\/api\/health/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 100,
      message: 'Health check rate limit exceeded',
      standardHeaders: false,
    },
    description: 'Health check endpoint',
    authRequired: false,
  },

  // Webhook endpoints - separate limits per webhook
  {
    pattern: /^\/api\/webhooks/,
    options: {
      windowMs: 60 * 1000, // 1 minute
      max: 100,
      message: 'Webhook rate limit exceeded',
      standardHeaders: true,
      keyGenerator: (req: NextRequest) => {
        const webhookType = req.nextUrl.pathname.split('/').pop();
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        return `rate_limit:webhook:${webhookType}:${ip}`;
      },
    },
    description: 'Webhook endpoints',
    authRequired: false,
  },

  // Public API endpoints - general limits
  {
    pattern: /^\/api\/public/,
    options: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100,
      message: 'Public API rate limit exceeded',
      standardHeaders: true,
    },
    description: 'Public API endpoints',
    authRequired: false,
  },

  // Default for all other API endpoints
  {
    pattern: /^\/api\//,
    options: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100,
      message: 'API rate limit exceeded',
      standardHeaders: true,
    },
    description: 'General API endpoints',
    authRequired: false,
  },
];

/**
 * Custom rate limit configurations for specific scenarios
 */
export const CUSTOM_RATE_LIMITS = {
  // Burst protection for auth endpoints
  AUTH_BURST: {
    windowMs: 10 * 1000, // 10 seconds
    max: 3,
    message: 'Too many rapid requests, please slow down',
  },

  // Strict limits for sensitive operations
  SENSITIVE_OPERATIONS: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1,
    message: 'This operation has a strict rate limit for security',
  },

  // Development/testing - more lenient
  DEVELOPMENT: {
    windowMs: 60 * 1000, // 1 minute
    max: 1000,
    message: 'Development rate limit exceeded',
  },

  // Premium users - higher limits
  PREMIUM_USER: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 500,
    message: 'Premium user rate limit exceeded',
  },

  // Mobile app - optimized for mobile usage patterns
  MOBILE_APP: {
    windowMs: 60 * 1000, // 1 minute
    max: 120,
    message: 'Mobile app rate limit exceeded',
  },
} as const;

/**
 * Find matching rate limit configuration for a request
 */
export function findRateLimitConfig(pathname: string): RateLimitConfig | null {
  // Find the most specific match (longest pattern match)
  let bestMatch: RateLimitConfig | null = null;
  let bestMatchLength = 0;

  for (const config of RATE_LIMIT_CONFIGS) {
    if (config.pattern instanceof RegExp) {
      if (config.pattern.test(pathname)) {
        const matchLength = config.pattern.source.length;
        if (matchLength > bestMatchLength) {
          bestMatch = config;
          bestMatchLength = matchLength;
        }
      }
    } else {
      if (pathname.startsWith(config.pattern)) {
        const matchLength = config.pattern.length;
        if (matchLength > bestMatchLength) {
          bestMatch = config;
          bestMatchLength = matchLength;
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Get user-specific rate limit based on user type/subscription
 */
export function getUserRateLimit(
  userType: string,
  subscriptionTier?: string
): Partial<RateLimitOptions> {
  const baseConfig: Partial<RateLimitOptions> = {};

  switch (userType) {
    case 'admin':
      return {
        ...baseConfig,
        max: 1000,
        windowMs: 60 * 60 * 1000, // 1 hour
      };

    case 'premium':
      return {
        ...baseConfig,
        max: 500,
        windowMs: 60 * 60 * 1000, // 1 hour
      };

    case 'pro':
      return {
        ...baseConfig,
        max: 300,
        windowMs: 60 * 60 * 1000, // 1 hour
      };

    case 'free':
    default:
      return {
        ...baseConfig,
        max: 100,
        windowMs: 60 * 60 * 1000, // 1 hour
      };
  }
}

/**
 * Environment-specific adjustments
 */
export function adjustForEnvironment(
  config: RateLimitOptions,
  environment: string = process.env.NODE_ENV || 'development'
): RateLimitOptions {
  const adjusted = { ...config };

  switch (environment) {
    case 'development':
      // More lenient in development
      adjusted.max = Math.max(adjusted.max * 10, 1000);
      break;

    case 'test':
      // Even more lenient for testing
      adjusted.max = 10000;
      adjusted.windowMs = 1000; // 1 second
      break;

    case 'production':
      // Use config as-is for production
      break;

    default:
      break;
  }

  return adjusted;
}

/**
 * Special rate limits for specific IP ranges or user agents
 */
export function getSpecialRateLimit(request: NextRequest): Partial<RateLimitOptions> | null {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

  // Bot detection - stricter limits
  if (/bot|crawler|spider|scraper/i.test(userAgent)) {
    return {
      max: 10,
      windowMs: 60 * 1000, // 1 minute
      message: 'Bot rate limit applied',
    };
  }

  // Internal tools - more lenient
  if (userAgent.includes('Internal-Tool') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return {
      max: 1000,
      windowMs: 60 * 1000, // 1 minute
    };
  }

  // Mobile apps - optimized limits
  if (userAgent.includes('Mobile') || userAgent.includes('Strive-App')) {
    return {
      max: 120,
      windowMs: 60 * 1000, // 1 minute
    };
  }

  return null;
}

export default {
  RATE_LIMIT_CONFIGS,
  CUSTOM_RATE_LIMITS,
  findRateLimitConfig,
  getUserRateLimit,
  adjustForEnvironment,
  getSpecialRateLimit,
};