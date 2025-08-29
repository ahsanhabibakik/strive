import { MetadataRoute } from 'next'
import { clientEnv } from '@/lib/config/env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = clientEnv.APP_URL

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact', 
          '/faq',
          '/support',
          '/blog',
          '/blog/*',
          '/terms',
          '/privacy',
          '/cookies',
          '/auth/signin',
          '/auth/signup',
          '/auth/forgot-password',
        ],
        disallow: [
          '/dashboard/*', // Private dashboard areas
          '/auth/reset-password/*', // Password reset tokens
          '/api/*', // API endpoints
          '/admin/*', // Admin areas
          '/*?*', // URLs with query parameters
          '/test*', // Test pages
          '/*.json$', // JSON files
          '/private/*', // Private directories
          '/internal/*', // Internal pages
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/', // Disallow AI crawlers if desired
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}