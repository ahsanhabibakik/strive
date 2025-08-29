import type { NextConfig } from 'next'
import { getSecurityHeaders } from './headers'

export function getSecurityConfig(): Partial<NextConfig> {
  const securityHeaders = getSecurityHeaders()

  return {
    // Security headers
    async headers() {
      return [
        {
          // Apply security headers to all routes
          source: '/(.*)',
          headers: Object.entries(securityHeaders).map(([key, value]) => ({
            key,
            value,
          })),
        },
      ]
    },

    // Redirects for security
    async redirects() {
      return [
        // Redirect HTTP to HTTPS in production
        ...(process.env.NODE_ENV === 'production' ? [
          {
            source: '/(.*)',
            has: [
              {
                type: 'header',
                key: 'x-forwarded-proto',
                value: 'http',
              },
            ],
            destination: 'https://your-domain.com/:path*',
            permanent: true,
          },
        ] : []),
      ]
    },

    // Image optimization security
    images: {
      domains: [
        'res.cloudinary.com',
        'images.unsplash.com',
        'avatars.githubusercontent.com',
        'lh3.googleusercontent.com',
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '**.googleapis.com',
          pathname: '/**',
        },
      ],
      // Limit image sizes to prevent abuse
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      formats: ['image/webp', 'image/avif'],
    },

    // Security-related experimental features
    experimental: {
      // Enable Server Components
      serverComponentsExternalPackages: ['mongoose'],
      
      // Security-related optimizations
      optimizePackageImports: ['@radix-ui/react-icons'],
    },

    // Webpack security configurations
    webpack: (config: any) => {
      // Security: Don't expose source maps in production
      if (process.env.NODE_ENV === 'production') {
        config.devtool = false
      }

      // Security: Prevent bundling of server-only packages
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ensure certain packages are not included in client bundle
      }

      return config
    },

    // Environment variable security
    env: {
      // Only expose client-safe environment variables
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    },

    // Output security
    output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

    // Compiler optimizations for security
    compiler: {
      // Remove console.log in production
      removeConsole: process.env.NODE_ENV === 'production',
    },

    // TypeScript security
    typescript: {
      // Fail build on type errors
      ignoreBuildErrors: false,
    },

    // ESLint security
    eslint: {
      // Fail build on ESLint errors
      ignoreDuringBuilds: false,
    },

    // PoweredByHeader security
    poweredByHeader: false,

    // Compression for performance and security
    compress: true,

    // Asset prefix for CDN security
    ...(process.env.CDN_URL ? { assetPrefix: process.env.CDN_URL } : {}),
  }
}

// Content Security Policy reporting
export function getCSPReportingConfig() {
  if (process.env.NODE_ENV !== 'production') {
    return {}
  }

  return {
    'report-uri': '/api/csp-report',
    'report-to': 'csp-endpoint',
  }
}

// Security monitoring configuration
export function getSecurityMonitoringConfig() {
  return {
    // Rate limiting configuration
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
    },

    // CORS configuration for API routes
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.NEXT_PUBLIC_APP_URL!]
        : true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    },

    // Session security
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
    },

    // JWT security
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  }
}

export default getSecurityConfig