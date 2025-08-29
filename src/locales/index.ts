import { en } from './en'

export const locales = {
  en,
}

export const defaultLocale = 'en'
export const supportedLocales = Object.keys(locales) as Array<keyof typeof locales>

export type Locale = keyof typeof locales
export type TranslationKeys = typeof en

// Helper function to get nested translation value
export function getTranslation(
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

// Helper to check if a locale is supported
export function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}

// Helper to get the best matching locale
export function getBestMatchingLocale(requestedLocales: string[]): Locale {
  for (const locale of requestedLocales) {
    const normalizedLocale = locale.split('-')[0].toLowerCase()
    if (isSupportedLocale(normalizedLocale)) {
      return normalizedLocale
    }
  }
  return defaultLocale
}

export { en }
export default locales