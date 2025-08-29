'use client'

import { type ReactNode } from 'react'
import ReduxProvider from './ReduxProvider'
import { Toaster } from '@/components/ui/toaster'
import { type Locale } from '@/locales'

interface AppProvidersProps {
  children: ReactNode
  locale?: Locale
}

/**
 * Combined provider component that wraps all app-level providers
 * - Redux store provider
 * - I18n provider
 * - Toast notifications
 */
export function AppProviders({ children, locale }: AppProvidersProps) {
  return (
    <ReduxProvider locale={locale}>
      {children}
      <Toaster />
    </ReduxProvider>
  )
}

export default AppProviders