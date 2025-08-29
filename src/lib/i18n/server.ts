import { headers } from 'next/headers'
import { locales, defaultLocale, getBestMatchingLocale, type Locale } from '@/locales'

/**
 * Server-side locale detection for Next.js App Router
 */
export async function getLocale(): Promise<Locale> {
  const headersList = await headers()
  
  // Try to get locale from cookie first
  const cookieLocale = getCookieLocaleFromHeaders(headersList)
  if (cookieLocale) {
    return cookieLocale
  }
  
  // Fallback to Accept-Language header
  const acceptLanguage = headersList.get('accept-language') || ''
  const browserLocales = parseAcceptLanguage(acceptLanguage)
  
  return getBestMatchingLocale(browserLocales)
}

/**
 * Get translations for server components
 */
export async function getTranslations(locale?: Locale) {
  const resolvedLocale = locale || await getLocale()
  return locales[resolvedLocale]
}

/**
 * Server-side translation function
 */
export async function getServerTranslation(
  key: string, 
  params?: Record<string, any>,
  locale?: Locale
): Promise<string> {
  const translations = await getTranslations(locale)
  return getTranslationValue(translations, key, params)
}

// Helper functions
function getCookieLocaleFromHeaders(headersList: Headers): Locale | null {
  const cookieHeader = headersList.get('cookie')
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const localeCookie = cookies.find(cookie => cookie.startsWith('locale='))
  
  if (localeCookie) {
    const locale = localeCookie.split('=')[1]
    return locale as Locale
  }
  
  return null
}

function parseAcceptLanguage(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';')
      return parts[0].trim()
    })
    .filter(Boolean)
}

function getTranslationValue(
  translations: any,
  key: string,
  params?: Record<string, any>
): string {
  const keys = key.split('.')
  let value = translations
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  // Replace parameters in the translation
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match
    })
  }
  
  return value
}

/**
 * Generate locale-specific metadata for pages
 */
export async function getLocaleMetadata(locale?: Locale) {
  const resolvedLocale = locale || await getLocale()
  const translations = await getTranslations(resolvedLocale)
  
  return {
    locale: resolvedLocale,
    direction: getTextDirection(resolvedLocale),
    translations,
    // Helper to get translated metadata
    getTitle: (key: string, params?: Record<string, any>) => 
      getTranslationValue(translations, key, params),
    getDescription: (key: string, params?: Record<string, any>) => 
      getTranslationValue(translations, key, params),
  }
}

function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  // Add RTL languages here when supported
  const rtlLanguages: Locale[] = []
  return rtlLanguages.includes(locale) ? 'rtl' : 'ltr'
}

// Export types for server components
export type ServerTranslations = Awaited<ReturnType<typeof getTranslations>>
export type LocaleMetadata = Awaited<ReturnType<typeof getLocaleMetadata>>