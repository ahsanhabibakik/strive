'use client'

import { useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { useI18n, useLocale } from '@/lib/i18n/context'
import { supportedLocales, type Locale } from '@/locales'
import { getLanguageMetadata } from '@/lib/i18n/config'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact'
  align?: 'start' | 'center' | 'end'
}

export function LanguageSwitcher({ 
  variant = 'default', 
  align = 'end' 
}: LanguageSwitcherProps) {
  const { t } = useI18n()
  const { locale, setLocale, isLoading } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = getLanguageMetadata(locale)

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{currentLanguage.flag}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-[200px]">
          {supportedLocales.map((supportedLocale) => {
            const language = getLanguageMetadata(supportedLocale)
            const isSelected = locale === supportedLocale
            
            return (
              <DropdownMenuItem
                key={supportedLocale}
                onClick={() => handleLanguageChange(supportedLocale)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {language.nativeName}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[200px]">
        {supportedLocales.map((supportedLocale) => {
          const language = getLanguageMetadata(supportedLocale)
          const isSelected = locale === supportedLocale
          
          return (
            <DropdownMenuItem
              key={supportedLocale}
              onClick={() => handleLanguageChange(supportedLocale)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {language.nativeName}
                  </span>
                </div>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher