import { locales, defaultLocale, supportedLocales, type Locale } from '@/locales'

export const i18nConfig = {
  defaultLocale,
  supportedLocales,
  locales,
  fallbackLocale: defaultLocale,
  // Namespace loading strategy
  loadNamespaces: ['common', 'navigation'], // Always load these
  // Cookie/storage settings
  cookieName: 'locale',
  cookieMaxAge: 365 * 24 * 60 * 60, // 1 year
  // Detection settings
  detection: {
    order: ['cookie', 'header', 'navigator'],
    caches: ['cookie'],
  },
} as const

export type I18nConfig = typeof i18nConfig

// Language metadata for UI display
export const languageMetadata: Record<Locale, {
  name: string
  nativeName: string
  flag: string
  rtl: boolean
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
  },
  // Future languages can be added here
  // es: {
  //   name: 'Spanish',
  //   nativeName: 'Español',
  //   flag: '🇪🇸',
  //   rtl: false,
  // },
  // ar: {
  //   name: 'Arabic',
  //   nativeName: 'العربية',
  //   flag: '🇸🇦',
  //   rtl: true,
  // },
}

export function getLanguageMetadata(locale: Locale) {
  return languageMetadata[locale] || languageMetadata[defaultLocale]
}

export default i18nConfig