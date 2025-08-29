import Head from 'next/head'
import { useRouter } from 'next/router'
import { clientEnv } from '@/lib/config/env'

export interface SEOProps {
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
  nofollow?: boolean
  canonical?: string
  alternates?: Array<{
    hrefLang: string
    href: string
  }>
  structuredData?: Record<string, any>
}

export const SEOHead: React.FC<SEOProps> = ({
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
  nofollow = false,
  canonical,
  alternates = [],
  structuredData
}) => {
  const router = useRouter()
  
  // Construct full title
  const fullTitle = title ? `${title} | ${clientEnv.APP_NAME}` : clientEnv.APP_NAME
  
  // Construct canonical URL
  const canonicalUrl = canonical || `${clientEnv.APP_URL}${router.asPath}`
  
  // Construct image URL
  const imageUrl = image ? (image.startsWith('http') ? image : `${clientEnv.APP_URL}${image}`) : `${clientEnv.APP_URL}/og-image.png`
  
  // Combine keywords with tags
  const allKeywords = [...keywords, ...tags].join(', ')
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {allKeywords && <meta name="keywords" content={allKeywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Robots */}
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate URLs */}
      {alternates.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={clientEnv.APP_NAME} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title || clientEnv.APP_NAME} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article specific */}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && section && <meta property="article:section" content={section} />}
      {type === 'article' && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title || clientEnv.APP_NAME} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  )
}

export default SEOHead