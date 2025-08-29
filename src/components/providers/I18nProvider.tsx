'use client'

import { I18nProvider as I18nContextProvider } from '@/lib/i18n/context'
import { type Locale } from '@/locales'

interface I18nProviderProps {
  children: React.ReactNode
  locale?: Locale
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  return (
    <I18nContextProvider initialLocale={locale}>
      {children}
    </I18nContextProvider>
  )
}

export default I18nProvider