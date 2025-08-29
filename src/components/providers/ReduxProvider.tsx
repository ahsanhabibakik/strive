'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { I18nProvider } from './I18nProvider'
import { type Locale } from '@/locales'

interface ReduxProviderProps {
  children: React.ReactNode
  locale?: Locale
}

export default function ReduxProvider({ children, locale }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <I18nProvider locale={locale}>
        {children}
      </I18nProvider>
    </Provider>
  )
}