import { NextRequest } from "next/server";

// Simple rate limit interface for API routes
interface RateLimitOptions {
  rpm?: number; // Requests per minute
}

interface RateLimitResult {
  success: boolean;
  headers?: Record<string, string>;
}

// Simple in-memory rate limiting for development
const requests = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  request: NextRequest, 
  options: RateLimitOptions = { rpm: 60 }
): Promise<RateLimitResult> {
  const { rpm = 60 } = options;
  
  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const windowStart = now - windowMs;
  
  // Clean expired entries
  for (const [k, v] of requests.entries()) {
    if (v.resetTime < now) {
      requests.delete(k);
    }
  }
  
  const existing = requests.get(key);
  
  if (!existing || existing.resetTime < windowStart) {
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }
  
  existing.count++;
  
  if (existing.count > rpm) {
    const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
    return { 
      success: false,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': rpm.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(existing.resetTime).toISOString()
      }
    };
  }
  
  return { success: true };
}