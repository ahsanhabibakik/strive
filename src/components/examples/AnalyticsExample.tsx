'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAnalytics } from '@/lib/analytics'
import { analytics } from '@/lib/analytics'

export const AnalyticsExample = () => {
  const {
    hasConsent,
    identifyUser,
    track,
    trackPageView,
    trackGoalCreated,
    trackGoalCompleted,
    trackSubscription,
    trackFormSubmit
  } = useAnalytics()

  useEffect(() => {
    // Track page view when component mounts
    trackPageView('Analytics Example Page')
  }, [trackPageView])

  const handleSignUpExample = () => {
    // Track sign up across all platforms
    analytics.trackSignUp('email', {
      source: 'analytics_example',
      campaign: 'demo'
    })
    
    // Identify user (in real app, you'd get this from auth)
    identifyUser('demo_user_123', {
      name: 'Demo User',
      email: 'demo@example.com',
      plan: 'free',
      signup_method: 'email'
    })
  }

  const handleGoalCreationExample = () => {
    trackGoalCreated({
      goalType: 'fitness',
      targetDate: '2024-12-31',
      priority: 'high'
    })

    // Also track via unified analytics
    analytics.trackGoalCreated('fitness', {
      category: 'health',
      difficulty: 'intermediate',
      estimated_duration: 90
    })
  }

  const handleSubscriptionExample = () => {
    trackSubscription({
      plan: 'pro',
      value: 29.99,
      currency: 'USD'
    })

    // Also track via unified analytics
    analytics.trackSubscription('pro', 29.99, 'USD')
  }

  const handleCustomEventExample = () => {
    track('demo_button_clicked', {
      button_name: 'Custom Event Demo',
      page: 'Analytics Example',
      timestamp: new Date().toISOString()
    })
  }

  const handleFormExample = () => {
    trackFormSubmit('demo_form', {
      form_type: 'contact',
      fields_filled: 3,
      completion_time: 45
    })
  }

  const handleGoalCompletionExample = () => {
    trackGoalCompleted({
      goalId: 'demo_goal_123',
      completionTime: 30, // 30 days
      category: 'fitness'
    })
  }

  if (!hasConsent) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Analytics Demo</CardTitle>
          <CardDescription>
            Please accept analytics cookies to see the demo in action.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Analytics Integration Demo</CardTitle>
        <CardDescription>
          Test all analytics tools (Microsoft Clarity, Hotjar, PostHog, Mixpanel, Facebook Pixel)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleSignUpExample} variant="default">
            🎯 Track Sign Up
          </Button>
          
          <Button onClick={handleGoalCreationExample} variant="default">
            📝 Track Goal Created
          </Button>
          
          <Button onClick={handleGoalCompletionExample} variant="default">
            ✅ Track Goal Completed
          </Button>
          
          <Button onClick={handleSubscriptionExample} variant="default">
            💳 Track Subscription
          </Button>
          
          <Button onClick={handleCustomEventExample} variant="outline">
            🔧 Track Custom Event
          </Button>
          
          <Button onClick={handleFormExample} variant="outline">
            📋 Track Form Submit
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Analytics Status:</h3>
          <ul className="text-sm space-y-1">
            <li>✅ <strong>Consent Granted:</strong> {hasConsent ? 'Yes' : 'No'}</li>
            <li>✅ <strong>Google Analytics:</strong> {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'Configured' : 'Not configured'}</li>
            <li>✅ <strong>Microsoft Clarity:</strong> {process.env.NEXT_PUBLIC_CLARITY_ID ? 'Configured' : 'Not configured'}</li>
            <li>✅ <strong>Hotjar:</strong> {process.env.NEXT_PUBLIC_HOTJAR_ID ? 'Configured' : 'Not configured'}</li>
            <li>✅ <strong>PostHog:</strong> {process.env.NEXT_PUBLIC_POSTHOG_KEY ? 'Configured' : 'Not configured'}</li>
            <li>✅ <strong>Mixpanel:</strong> {process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ? 'Configured' : 'Not configured'}</li>
            <li>✅ <strong>Facebook Pixel:</strong> {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ? 'Configured' : 'Not configured'}</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How to check if it's working:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li><strong>Microsoft Clarity:</strong> Check browser dev tools console for Clarity events</li>
            <li><strong>Hotjar:</strong> Look for the Hotjar feedback widget on the page</li>
            <li><strong>PostHog:</strong> Check browser dev tools → Network tab for PostHog requests</li>
            <li><strong>Mixpanel:</strong> Check browser dev tools → Network tab for Mixpanel requests</li>
            <li><strong>Facebook Pixel:</strong> Use Facebook Pixel Helper browser extension</li>
            <li><strong>Google Analytics:</strong> Use Google Analytics Debugger extension</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}