import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from '@/lib/config/env'

export interface SecurityHeaders {
  'X-Content-Type-Options': string
  'X-Frame-Options': string
  'X-XSS-Protection': string
  'Referrer-Policy': string
  'Permissions-Policy': string
  'Strict-Transport-Security': string
  'Content-Security-Policy': string
  'X-DNS-Prefetch-Control': string
  'X-Download-Options': string
  'X-Permitted-Cross-Domain-Policies': string
}

// Content Security Policy configuration
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Next.js requires this for development
    "'unsafe-eval'", // Next.js requires this for development
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://cdn.vercel-insights.com',
    'https://js.stripe.com',
    'https://api.mixpanel.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://res.cloudinary.com',
    'https://images.unsplash.com',
    'https://avatars.githubusercontent.com',
    'https://lh3.googleusercontent.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    'https://api.mixpanel.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-insights.com',
    'https://api.stripe.com',
    env.NEXT_PUBLIC_API_URL,
    env.MONGODB_URI ? new URL(env.MONGODB_URI).origin : '',
  ].filter(Boolean),
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com',
  ],
  'object-src': ["'none'"],
  'media-src': ["'self'", 'https:'],
  'worker-src': [
    "'self'",
    'blob:',
  ],
  'child-src': [
    "'self'",
    'blob:',
  ],
  'form-action': [
    "'self'",
  ],
  'base-uri': [
    "'self'",
  ],
}

function generateCSP(): string {
  const csp = Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  
  return csp
}

export function getSecurityHeaders(isDevelopment = false): SecurityHeaders {
  const csp = generateCSP()
  
  const headers: SecurityHeaders = {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // XSS protection (legacy)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
    ].join(', '),
    
    // HSTS (only in production with HTTPS)
    'Strict-Transport-Security': env.NODE_ENV === 'production' 
      ? 'max-age=31536000; includeSubDomains; preload'
      : 'max-age=0',
    
    // Content Security Policy
    'Content-Security-Policy': isDevelopment 
      ? csp.replace("'unsafe-inline'", "'unsafe-inline' 'unsafe-eval'")
      : csp,
    
    // DNS prefetch control
    'X-DNS-Prefetch-Control': 'on',
    
    // IE download options
    'X-Download-Options': 'noopen',
    
    // Cross-domain policies
    'X-Permitted-Cross-Domain-Policies': 'none',
  }

  return headers
}

export function applySecurityHeaders(response: NextResponse, request?: NextRequest): NextResponse {
  const isDevelopment = env.NODE_ENV === 'development'
  const securityHeaders = getSecurityHeaders(isDevelopment)
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add additional security headers for API routes
  if (request?.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-Robots-Tag', 'noindex')
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  
  return response
}

// Middleware helper for applying security headers
export function withSecurityHeaders(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest) => {
    const response = await handler(request)
    return applySecurityHeaders(response, request)
  }
}

// Security header validation
export function validateCSP(csp: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check for dangerous directives
  if (csp.includes("'unsafe-eval'") && env.NODE_ENV === 'production') {
    errors.push("unsafe-eval should not be used in production")
  }
  
  if (csp.includes("'unsafe-inline'") && env.NODE_ENV === 'production') {
    errors.push("Consider removing unsafe-inline in production for better security")
  }
  
  if (csp.includes('*')) {
    errors.push("Wildcard (*) sources are not recommended")
  }
  
  // Check for required directives
  const requiredDirectives = ['default-src', 'script-src', 'style-src']
  requiredDirectives.forEach(directive => {
    if (!csp.includes(directive)) {
      errors.push(`Missing required directive: ${directive}`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export default { getSecurityHeaders, applySecurityHeaders, withSecurityHeaders, validateCSP }