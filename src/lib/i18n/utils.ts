import { type Locale, supportedLocales } from '@/locales'

/**
 * Utility functions for i18n management
 */

/**
 * Format numbers based on locale
 */
export function formatNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number)
}

/**
 * Format currency based on locale
 */
export function formatCurrency(
  amount: number,
  currency: string,
  locale: Locale
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format dates based on locale
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Format relative time based on locale
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date
  
  const now = new Date()
  const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000
  
  const rtf = new Intl.RelativeTimeFormat(locale, options)
  
  // Determine the appropriate unit
  const absDiff = Math.abs(diffInSeconds)
  
  if (absDiff < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second')
  } else if (absDiff < 3600) {
    return rtf.format(Math.round(diffInSeconds / 60), 'minute')
  } else if (absDiff < 86400) {
    return rtf.format(Math.round(diffInSeconds / 3600), 'hour')
  } else if (absDiff < 604800) {
    return rtf.format(Math.round(diffInSeconds / 86400), 'day')
  } else if (absDiff < 2629746) {
    return rtf.format(Math.round(diffInSeconds / 604800), 'week')
  } else if (absDiff < 31556952) {
    return rtf.format(Math.round(diffInSeconds / 2629746), 'month')
  } else {
    return rtf.format(Math.round(diffInSeconds / 31556952), 'year')
  }
}

/**
 * Pluralization helper
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
  locale: Locale = 'en'
): string {
  const pr = new Intl.PluralRules(locale)
  const rule = pr.select(count)
  
  if (rule === 'one') {
    return `${count} ${singular}`
  }
  
  return `${count} ${plural || singular + 's'}`
}

/**
 * Sort array of strings based on locale collation
 */
export function sortByLocale<T>(
  array: T[],
  getValue: (item: T) => string,
  locale: Locale,
  options?: Intl.CollatorOptions
): T[] {
  const collator = new Intl.Collator(locale, options)
  
  return [...array].sort((a, b) => 
    collator.compare(getValue(a), getValue(b))
  )
}

/**
 * Check if text direction is RTL for a locale
 */
export function isRTL(locale: Locale): boolean {
  // Add RTL languages here when supported
  const rtlLanguages: Locale[] = [] // e.g., ['ar', 'he', 'fa']
  return rtlLanguages.includes(locale)
}

/**
 * Get the text direction for CSS
 */
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

/**
 * Validate if a locale is supported
 */
export function validateLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}

/**
 * Get locale from URL pathname
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/').filter(Boolean)
  const potentialLocale = segments[0]
  
  return validateLocale(potentialLocale) ? potentialLocale : null
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string, locale: Locale): string {
  if (pathname.startsWith(`/${locale}`)) {
    return pathname.slice(locale.length + 1) || '/'
  }
  return pathname
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === 'en') return pathname // Don't add default locale to URL
  
  return `/${locale}${pathname === '/' ? '' : pathname}`
}

/**
 * Format file size based on locale
 */
export function formatFileSize(
  bytes: number,
  locale: Locale,
  decimals: number = 2
): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return formatNumber(
    parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    locale
  ) + ' ' + sizes[i]
}

/**
 * Helper to create translation keys type-safely
 */
export function createTranslationKey<T extends string>(key: T): T {
  return key
}

// Export common date/time format options
export const dateFormats = {
  short: { year: 'numeric', month: 'short', day: 'numeric' } as const,
  medium: { year: 'numeric', month: 'long', day: 'numeric' } as const,
  long: { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long' 
  } as const,
  time: { hour: '2-digit', minute: '2-digit' } as const,
  datetime: { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  } as const,
}

export const currencyFormats = {
  standard: { minimumFractionDigits: 2, maximumFractionDigits: 2 } as const,
  compact: { notation: 'compact', maximumFractionDigits: 1 } as const,
  accounting: { currencySign: 'accounting' } as const,
} as const