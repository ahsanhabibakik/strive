const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Optimize images with different sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ]
      },
      {
        // Cache static assets
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache API responses (adjust based on your needs)
        source: '/api/health',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=30',
          },
        ],
      },
    ];
  },
  
  // Configure redirects
  async redirects() {
    return [
      // Redirect old dashboard route to new one (example)
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
      // Redirect marketing pages (example)
      {
        source: '/signup',
        destination: '/auth/signin',
        permanent: true,
      },
    ];
  },
  
  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Configure build output
  output: 'standalone',
  
  // Optimize bundle size
  experimental: {
    // Enable modern JavaScript features
    esmExternals: true,
    // Optimize server-side rendering
    serverComponentsExternalPackages: ['mongoose'],
    // Enable build-time optimizations
    optimizePackageImports: [
      '@heroicons/react',
      'recharts',
      'date-fns',
      'lodash'
    ],
  },
  
  // Configure webpack for better builds
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      // Replace React with Preact in client-side production builds (optional)
      // Object.assign(config.resolve.alias, {
      //   'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
      //   react: 'preact/compat',
      //   'react-dom/test-utils': 'preact/test-utils',
      //   'react-dom': 'preact/compat',
      // });
    }
    
    // Handle .svg files as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Optimize for production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    
    return config;
  },
  
  // TypeScript configuration
  typescript: {
    // Allow production builds to complete even if there are type errors
    // (not recommended for production)
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    // (not recommended for production)
    ignoreDuringBuilds: false,
  },
  
  // Configure API routes
  async rewrites() {
    return [
      // Proxy API requests (if needed)
      {
        source: '/api/stripe/:path*',
        destination: '/api/billing/:path*',
      },
    ];
  },
  
  // Configure page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Power optimizations
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  
  // Configure tracing (for debugging)
  experimental: {
    instrumentationHook: true,
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true, // Suppresses source map uploading logs during build
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Upload source maps in production only
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring/tunnel",
  hideSourceMaps: true,
  disableLogger: true,
};

// Make sure adding Sentry options is the last code to run before exporting
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN 
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;