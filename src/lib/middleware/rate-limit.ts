import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'redis';
import { logger } from '../monitoring';
import { RateLimitError } from '../errors';
import { logRateLimitViolation, logRateLimitSuccess, shouldBlockIP } from './rate-limit-monitor';

// Redis client with connection pooling
let redisClient: Redis | null = null;

// In-memory fallback store
const memoryStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number;      // Time window in milliseconds
  max: number;          // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  standardHeaders?: boolean; // Send standard rate limit headers
  legacyHeaders?: boolean;   // Send legacy headers
  message?: string;
  onLimitReached?: (request: NextRequest) => void;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  used: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Initialize Redis client with connection handling
 */
async function getRedisClient(): Promise<Redis | null> {
  if (redisClient) return redisClient;

  if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
    logger.warn('Redis configuration not found, using in-memory rate limiting');
    return null;
  }

  try {
    const redisConfig = process.env.REDIS_URL 
      ? { url: process.env.REDIS_URL }
      : {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
          db: parseInt(process.env.REDIS_DB || '0'),
        };

    redisClient = new Redis({
      ...redisConfig,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
      redisClient = null;
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected for rate limiting');
    });

    redisClient.on('disconnect', () => {
      logger.warn('Redis disconnected, falling back to memory store');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    return null;
  }
}

/**
 * Default key generator function
 */
function defaultKeyGenerator(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  const pathname = request.nextUrl.pathname;
  return `rate_limit:${ip}:${pathname}`;
}

/**
 * Redis-based rate limiting implementation
 */
async function redisRateLimit(
  key: string, 
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  if (!redis) {
    return memoryRateLimit(key, options);
  }

  try {
    const now = Date.now();
    const window = Math.floor(now / options.windowMs);
    const redisKey = `${key}:${window}`;

    // Use Redis pipeline for atomic operations
    const pipeline = redis.multi();
    pipeline.incr(redisKey);
    pipeline.expire(redisKey, Math.ceil(options.windowMs / 1000));
    
    const results = await pipeline.exec();
    const count = results?.[0]?.[1] as number || 0;
    
    const resetTime = (window + 1) * options.windowMs;
    const remaining = Math.max(0, options.max - count);
    
    const result: RateLimitResult = {
      success: count <= options.max,
      limit: options.max,
      used: count,
      remaining,
      resetTime,
      retryAfter: count > options.max ? Math.ceil((resetTime - now) / 1000) : undefined
    };

    return result;
  } catch (error) {
    logger.error('Redis rate limit error:', error);
    // Fallback to memory store on Redis error
    return memoryRateLimit(key, options);
  }
}

/**
 * In-memory fallback rate limiting implementation
 */
function memoryRateLimit(
  key: string, 
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;
  
  const stored = memoryStore.get(key);
  
  if (!stored || stored.resetTime < windowStart) {
    const resetTime = now + options.windowMs;
    memoryStore.set(key, { count: 1, resetTime });
    
    return {
      success: true,
      limit: options.max,
      used: 1,
      remaining: options.max - 1,
      resetTime
    };
  }
  
  stored.count++;
  const remaining = Math.max(0, options.max - stored.count);
  
  return {
    success: stored.count <= options.max,
    limit: options.max,
    used: stored.count,
    remaining,
    resetTime: stored.resetTime,
    retryAfter: stored.count > options.max ? Math.ceil((stored.resetTime - now) / 1000) : undefined
  };
}

/**
 * User-based rate limiting (requires authentication)
 */
async function userRateLimit(
  userId: string,
  endpoint: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const key = `rate_limit:user:${userId}:${endpoint}`;
  return redisRateLimit(key, options);
}

/**
 * IP-based rate limiting
 */
async function ipRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;
  const key = keyGenerator(request);
  return redisRateLimit(key, options);
}

/**
 * Apply rate limiting headers to response
 */
function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult,
  options: RateLimitOptions
): NextResponse {
  if (options.standardHeaders !== false) {
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
  }

  if (options.legacyHeaders) {
    response.headers.set('X-Rate-Limit-Limit', result.limit.toString());
    response.headers.set('X-Rate-Limit-Remaining', result.remaining.toString());
    response.headers.set('X-Rate-Limit-Reset', Math.ceil(result.resetTime / 1000).toString());
  }

  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString());
  }

  return response;
}

/**
 * Create rate limiting middleware
 */
export function createRateLimit(options: RateLimitOptions) {
  return function rateLimit(
    handler: (request: NextRequest) => Promise<NextResponse>
  ) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        // Check if IP should be blocked (based on previous violations)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || 'unknown';
        
        if (shouldBlockIP(ip)) {
          logRateLimitViolation(request, {
            success: false,
            limit: 0,
            used: 999,
            remaining: 0,
            resetTime: Date.now() + 15 * 60 * 1000, // 15 minutes
            retryAfter: 900 // 15 minutes
          }, 'ip');

          const blockResponse = NextResponse.json(
            {
              success: false,
              error: 'IP temporarily blocked due to excessive violations',
              code: 'IP_BLOCKED',
              retryAfter: 900
            },
            { status: 429 }
          );

          blockResponse.headers.set('Retry-After', '900');
          return blockResponse;
        }

        const result = await ipRateLimit(request, options);
        
        if (!result.success) {
          // Log rate limit violation with monitoring
          logRateLimitViolation(request, result, 'ip');

          // Call onLimitReached callback
          if (options.onLimitReached) {
            options.onLimitReached(request);
          }

          const errorResponse = NextResponse.json(
            {
              success: false,
              error: options.message || 'Too many requests',
              code: 'RATE_LIMIT_EXCEEDED',
              retryAfter: result.retryAfter
            },
            { status: 429 }
          );

          return applyRateLimitHeaders(errorResponse, result, options);
        }

        // Log successful request for monitoring
        logRateLimitSuccess(request, result);

        const response = await handler(request);
        return applyRateLimitHeaders(response, result, options);
        
      } catch (error) {
        logger.error('Rate limiting error:', error);
        // Continue without rate limiting on error
        return handler(request);
      }
    };
  };
}

/**
 * User-based rate limiting middleware (requires authenticated user)
 */
export function createUserRateLimit(
  endpoint: string,
  options: RateLimitOptions
) {
  return function userRateLimitMiddleware(
    handler: (request: NextRequest & { user?: { id: string } }) => Promise<NextResponse>
  ) {
    return async (request: NextRequest & { user?: { id: string } }): Promise<NextResponse> => {
      try {
        if (!request.user?.id) {
          // Fall back to IP-based rate limiting for unauthenticated users
          return createRateLimit(options)(handler)(request);
        }

        const result = await userRateLimit(request.user.id, endpoint, options);
        
        if (!result.success) {
          // Log user rate limit violation with monitoring
          logRateLimitViolation(request, result, 'user', request.user.id);

          if (options.onLimitReached) {
            options.onLimitReached(request);
          }

          const errorResponse = NextResponse.json(
            {
              success: false,
              error: options.message || 'Too many requests',
              code: 'RATE_LIMIT_EXCEEDED',
              retryAfter: result.retryAfter
            },
            { status: 429 }
          );

          return applyRateLimitHeaders(errorResponse, result, options);
        }

        // Log successful user request for monitoring
        logRateLimitSuccess(request, result);

        const response = await handler(request);
        return applyRateLimitHeaders(response, result, options);
        
      } catch (error) {
        logger.error('User rate limiting error:', error);
        return handler(request);
      }
    };
  };
}

/**
 * Cleanup expired entries from memory store
 */
function cleanupMemoryStore() {
  const now = Date.now();
  for (const [key, value] of memoryStore.entries()) {
    if (value.resetTime < now) {
      memoryStore.delete(key);
    }
  }
}

// Cleanup memory store every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupMemoryStore, 5 * 60 * 1000);
}

/**
 * Close Redis connection on app shutdown
 */
export async function closeRateLimit() {
  if (redisClient) {
    try {
      await redisClient.quit();
      redisClient = null;
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }
  memoryStore.clear();
}

export {
  RateLimitOptions,
  RateLimitResult,
  redisRateLimit,
  memoryRateLimit,
  userRateLimit,
  ipRateLimit
};