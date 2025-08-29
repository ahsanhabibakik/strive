'use client'

import { useState } from 'react'
import { useTranslation, useLocale } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatNumber, formatCurrency, formatDate, pluralize } from '@/lib/i18n/utils'

/**
 * Example component demonstrating i18n usage
 * This shows various translation patterns and utilities
 */
export function I18nExample() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [goalCount, setGoalCount] = useState(5)

  // Example data
  const exampleData = {
    revenue: 12345.67,
    userCount: 1234,
    date: new Date(),
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with language switcher */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {t('dashboard.overview')}
        </h1>
        <LanguageSwitcher />
      </div>

      {/* Basic translations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.actions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button>{t('common.save')}</Button>
            <Button variant="outline">{t('common.cancel')}</Button>
            <Button variant="destructive">{t('common.delete')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Nested translations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('landing.hero.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('landing.hero.description')}
          </p>
          <div className="mt-4 space-y-2">
            <Badge variant="secondary">
              {t('landing.pricing.free.name')}: {t('landing.pricing.free.price')}
            </Badge>
            <Badge variant="default">
              {t('landing.pricing.pro.name')}: {t('landing.pricing.pro.price')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Parameterized translations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('goals.goals')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setGoalCount(Math.max(0, goalCount - 1))}
            >
              -
            </Button>
            <span className="font-medium">
              {t('notifications.unreadNotifications', { count: goalCount })}
            </span>
            <Button
              variant="outline"
              onClick={() => setGoalCount(goalCount + 1)}
            >
              +
            </Button>
          </div>
          
          {goalCount === 0 && (
            <p className="text-muted-foreground">
              {t('goals.messages.noGoals')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Utility functions demo */}
      <Card>
        <CardHeader>
          <CardTitle>Formatting Examples (Locale: {locale})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Number: </span>
              {formatNumber(exampleData.userCount, locale)}
            </div>
            <div>
              <span className="font-medium">Currency: </span>
              {formatCurrency(exampleData.revenue, 'USD', locale)}
            </div>
            <div>
              <span className="font-medium">Date: </span>
              {formatDate(exampleData.date, locale, { dateStyle: 'medium' })}
            </div>
            <div>
              <span className="font-medium">Plural: </span>
              {pluralize(goalCount, 'goal', 'goals', locale)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature-specific translations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.signIn')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>{t('auth.dontHaveAccount')}</p>
          <Button className="w-full">{t('auth.createAccount')}</Button>
          <p className="text-xs text-muted-foreground">
            {t('auth.minLength', { count: 8 })}
          </p>
        </CardContent>
      </Card>

      {/* Error messages */}
      <Card>
        <CardHeader>
          <CardTitle>{t('errors.validation.required')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <p className="text-sm text-red-600">{t('errors.validation.email')}</p>
            <p className="text-sm text-red-600">{t('errors.validation.minLength', { count: 6 })}</p>
            <p className="text-sm text-red-600">{t('errors.validation.required')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Status messages */}
      <Card>
        <CardHeader>
          <CardTitle>{t('habits.messages.habitCompleted')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant="default">{t('goals.statuses.completed')}</Badge>
            <Badge variant="secondary">{t('goals.statuses.inProgress')}</Badge>
            <Badge variant="outline">{t('goals.statuses.notStarted')}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default I18nExample