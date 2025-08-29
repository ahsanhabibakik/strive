import { z } from 'zod'

const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Strive'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('Achieve Your Goals'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3000/api'),

  // Database
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Email Service
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // File Storage
  NEXT_PUBLIC_UPLOAD_MAX_SIZE: z.coerce.number().default(5242880), // 5MB
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),

  // External APIs
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Security
  ENCRYPTION_KEY: z.string().min(32, 'Encryption key must be at least 32 characters').optional(),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').optional(),
  
  // Monitoring & Logging
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_SOCIAL_SHARING: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_DARK_MODE: z.coerce.boolean().default(true),
  ENABLE_EMAIL_VERIFICATION: z.coerce.boolean().default(true),

  // Cache
  REDIS_URL: z.string().url().optional(),
  CACHE_TTL: z.coerce.number().default(3600), // 1 hour
})

// Parse and validate environment variables
function parseEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    throw new Error('Invalid environment configuration')
  }
}

export const env = parseEnv()

// Environment checks
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Client-safe environment variables (only those with NEXT_PUBLIC_)
export const clientEnv = {
  APP_NAME: env.NEXT_PUBLIC_APP_NAME,
  APP_DESCRIPTION: env.NEXT_PUBLIC_APP_DESCRIPTION,
  APP_URL: env.NEXT_PUBLIC_APP_URL,
  API_URL: env.NEXT_PUBLIC_API_URL,
  UPLOAD_MAX_SIZE: env.NEXT_PUBLIC_UPLOAD_MAX_SIZE,
  GA_MEASUREMENT_ID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  GTM_ID: env.NEXT_PUBLIC_GTM_ID,
  STRIPE_PUBLISHABLE_KEY: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ENABLE_ANALYTICS: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  ENABLE_SOCIAL_SHARING: env.NEXT_PUBLIC_ENABLE_SOCIAL_SHARING,
  ENABLE_NOTIFICATIONS: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
  ENABLE_DARK_MODE: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
}

export type ClientEnv = typeof clientEnv