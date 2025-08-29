'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Mail, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { showToast } from '@/lib/utils/toast'

interface EmailVerificationProps {
  token?: string
}

export function EmailVerification({ token }: EmailVerificationProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session, update } = useSession()
  const searchParams = useSearchParams()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired' | 'pending'>('loading')
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [error, setError] = useState('')

  // If token is provided, verify it immediately
  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else if (session?.user) {
      // Check if user needs email verification
      if ((session.user as any).emailVerified) {
        setStatus('success')
      } else {
        setStatus('pending')
      }
    }
  }, [token, session])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        showToast.success('Email verified successfully!')
        
        // Update session to reflect email verification
        await update()
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        if (data.code === 'TOKEN_EXPIRED') {
          setStatus('expired')
        } else {
          setStatus('error')
          setError(data.message || 'Verification failed')
        }
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setStatus('error')
      setError('An unexpected error occurred')
    }
  }

  const resendVerificationEmail = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        showToast.success('Verification email sent!')
        setResendCooldown(60) // 60 second cooldown
      } else {
        setError(data.message || 'Failed to send verification email')
      }
    } catch (error) {
      console.error('Resend email error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsResending(false)
    }
  }

  const handleSkipForNow = () => {
    router.push('/dashboard?emailVerification=skipped')
  }

  // Loading state
  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
            <p className="text-muted-foreground">Verifying your email...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (status === 'success') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Email Verified!
          </CardTitle>
          <CardDescription>
            Your email has been successfully verified. You now have full access to all features.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Redirecting you to dashboard...
          </p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Verification Failed
          </CardTitle>
          <CardDescription>
            We couldn't verify your email address.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              onClick={resendVerificationEmail}
              disabled={isResending || resendCooldown > 0}
              className="w-full"
            >
              {isResending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend Verification Email'
              }
            </Button>
            
            <Button variant="outline" onClick={handleSkipForNow} className="w-full">
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Expired token state
  if (status === 'expired') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-600">
            Link Expired
          </CardTitle>
          <CardDescription>
            This verification link has expired. Please request a new one.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              For security reasons, email verification links expire after 24 hours.
            </AlertDescription>
          </Alert>

          <Button
            onClick={resendVerificationEmail}
            disabled={isResending || resendCooldown > 0}
            className="w-full"
          >
            {isResending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : 'Send New Verification Email'
            }
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Pending verification state (no token, user not verified)
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to{' '}
          <span className="font-medium text-foreground">
            {session?.user?.email}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Please check your email and click the verification link to access all features.
            Don't forget to check your spam folder!
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Button
            onClick={resendVerificationEmail}
            disabled={isResending || resendCooldown > 0}
            variant="outline"
            className="w-full"
          >
            {isResending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {resendCooldown > 0 
              ? `Resend in ${resendCooldown}s` 
              : 'Resend Email'
            }
          </Button>
          
          <Button onClick={handleSkipForNow} variant="ghost" className="w-full">
            Skip for now (Limited features)
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Already verified?{' '}
            <button
              onClick={() => router.refresh()}
              className="text-primary hover:underline"
            >
              Refresh page
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmailVerification