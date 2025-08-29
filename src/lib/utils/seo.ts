import { Metadata } from 'next'
import { clientEnv } from '@/lib/config/env'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  canonical?: string
  alternates?: Record<string, string>
}

export function generateMetadata(config: SEOConfig, pathname: string = ''): Metadata {
  const {
    title,
    description = clientEnv.APP_DESCRIPTION,
    keywords = ['goal tracking', 'productivity', 'achievement', 'personal development'],
    image,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    noindex = false,
    canonical,
    alternates = {}
  } = config

  // Construct full title
  const fullTitle = title ? `${title} | ${clientEnv.APP_NAME}` : clientEnv.APP_NAME
  
  // Construct canonical URL
  const canonicalUrl = canonical || `${clientEnv.APP_URL}${pathname}`
  
  // Construct image URL
  const imageUrl = image 
    ? (image.startsWith('http') ? image : `${clientEnv.APP_URL}${image}`)
    : `${clientEnv.APP_URL}/og-image.png`
  
  // Combine keywords with tags
  const allKeywords = [...keywords, ...tags].join(', ')

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: author ? [{ name: author }] : undefined,
    
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },
    
    openGraph: {
      type: type as any,
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: clientEnv.APP_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || clientEnv.APP_NAME,
        },
      ],
      locale: 'en_US',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        section,
        authors: author ? [author] : undefined,
        tags,
      }),
    },
    
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    
    alternates: {
      canonical: canonicalUrl,
      ...alternates,
    },
    
    other: {
      'theme-color': '#000000',
      'msapplication-TileColor': '#000000',
    },
  }
}

// Structured data generators
export const structuredDataGenerators = {
  website: (name: string, url: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  organization: (name: string, url: string, logo: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${url}/contact`,
    },
    sameAs: [
      // Add social media URLs here
    ],
  }),

  article: (
    title: string,
    description: string,
    url: string,
    image: string,
    author: string,
    publishedTime: string,
    modifiedTime?: string
  ) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: clientEnv.APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${clientEnv.APP_URL}/logo.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
  }),

  person: (name: string, url: string, image: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    image,
    description,
  }),

  goal: (
    title: string,
    description: string,
    category: string,
    targetDate: string,
    progress?: number
  ) => ({
    '@context': 'https://schema.org',
    '@type': 'Goal',
    name: title,
    description,
    category,
    expectedEndTime: targetDate,
    ...(progress !== undefined && {
      progressPercentage: progress,
    }),
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  review: (
    name: string,
    rating: number,
    reviewBody: string,
    author: string,
    datePublished: string
  ) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: clientEnv.APP_NAME,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
    },
    name,
    reviewBody,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
  }),
}

// SEO utility functions
export const seoUtils = {
  // Generate page title with hierarchy
  generateTitle: (parts: string[]): string => {
    const validParts = parts.filter(Boolean)
    return validParts.length > 0 
      ? `${validParts.join(' | ')} | ${clientEnv.APP_NAME}`
      : clientEnv.APP_NAME
  },

  // Truncate description to optimal length
  truncateDescription: (text: string, maxLength: number = 160): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3).trim() + '...'
  },

  // Generate keywords from text
  extractKeywords: (text: string, existingKeywords: string[] = []): string[] => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    const uniqueWords = [...new Set([...existingKeywords, ...words])]
    return uniqueWords.slice(0, 20) // Limit to 20 keywords
  },

  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  },

  // Validate Open Graph image dimensions
  validateOGImage: (imageUrl: string): Promise<{ width: number; height: number; valid: boolean }> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({ width: 0, height: 0, valid: false })
        return
      }

      const img = new Image()
      img.onload = () => {
        const isValidSize = img.width >= 1200 && img.height >= 630
        resolve({
          width: img.width,
          height: img.height,
          valid: isValidSize,
        })
      }
      img.onerror = () => {
        resolve({ width: 0, height: 0, valid: false })
      }
      img.src = imageUrl
    })
  },
}

export default { generateMetadata, structuredDataGenerators, seoUtils }