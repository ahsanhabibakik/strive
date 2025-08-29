'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  type Locale, 
  defaultLocale, 
  isSupportedLocale, 
  getBestMatchingLocale,
  getTranslation,
  locales 
} from '@/locales'
import { i18nConfig } from './config'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, any>) => string
  isRTL: boolean
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

interface I18nProviderProps {
  children: React.ReactNode
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale)
  const [isLoading, setIsLoading] = useState(false)

  // Detect initial locale from browser/cookie
  useEffect(() => {
    if (initialLocale) return

    const detectLocale = () => {
      // Try to get from cookie first
      const cookieLocale = getCookieLocale()
      if (cookieLocale && isSupportedLocale(cookieLocale)) {
        return cookieLocale
      }

      // Fallback to browser language detection
      if (typeof navigator !== 'undefined') {
        const browserLocales = navigator.languages || [navigator.language]
        return getBestMatchingLocale(browserLocales)
      }

      return defaultLocale
    }

    const detectedLocale = detectLocale()
    setLocaleState(detectedLocale)
  }, [initialLocale])

  // Set locale and persist to cookie
  const setLocale = (newLocale: Locale) => {
    setIsLoading(true)
    setLocaleState(newLocale)
    setCookieLocale(newLocale)
    
    // Update document direction for RTL languages
    if (typeof document !== 'undefined') {
      const isRTL = getLanguageDirection(newLocale)
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
      document.documentElement.lang = newLocale
    }
    
    setIsLoading(false)
  }

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    const translations = locales[locale]
    return getTranslation(translations, key, params)
  }

  const isRTL = getLanguageDirection(locale)

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    isRTL,
    isLoading,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Utility functions
function getCookieLocale(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const localeCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${i18nConfig.cookieName}=`)
  )
  
  return localeCookie ? localeCookie.split('=')[1] : null
}

function setCookieLocale(locale: Locale) {
  if (typeof document === 'undefined') return
  
  const maxAge = i18nConfig.cookieMaxAge
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString()
  
  document.cookie = `${i18nConfig.cookieName}=${locale}; expires=${expires}; path=/; SameSite=Lax`
}

function getLanguageDirection(locale: Locale): boolean {
  // Add RTL language detection logic here when adding RTL languages
  const rtlLanguages: Locale[] = [] // e.g., ['ar', 'he', 'fa']
  return rtlLanguages.includes(locale)
}

// Hook for easy access to just the translation function
export function useTranslation() {
  const { t } = useI18n()
  return { t }
}

// Hook for locale management
export function useLocale() {
  const { locale, setLocale, isLoading } = useI18n()
  return { locale, setLocale, isLoading }
}

export default I18nProvider