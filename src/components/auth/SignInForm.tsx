'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Github, Mail, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { showToast } from '@/lib/utils/toast'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInForm = z.infer<typeof signInSchema>

interface SignInFormProps {
  callbackUrl?: string
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState<SignInForm>({
    email: '',
    password: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<SignInForm>>({})
  const [authError, setAuthError] = useState('')

  // Get error from URL params (from NextAuth)
  const urlError = searchParams?.get('error')

  const validateForm = () => {
    try {
      signInSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<SignInForm> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignInForm] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleInputChange = (field: keyof SignInForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setAuthError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError(
          result.error === 'CredentialsSignin' 
            ? t('auth.invalidCredentials')
            : 'An error occurred during sign in'
        )
      } else {
        // Success - refresh session and redirect
        await getSession()
        showToast.success(t('auth.signInSuccess'))
        router.push(callbackUrl || '/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setAuthError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: callbackUrl || '/dashboard' })
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      showToast.error(`Failed to sign in with ${provider}`)
      setIsLoading(false)
    }
  }

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
      case 'OAuthCallback':
        return 'Error with OAuth provider. Please try again.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account. Please try again.'
      case 'EmailCreateAccount':
        return 'Could not create account. Please try again.'
      case 'Callback':
        return 'Error in callback. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'This email is already registered with a different method.'
      case 'EmailSignin':
        return 'Check your email for the sign in link.'
      case 'CredentialsSignin':
        return t('auth.invalidCredentials')
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      default:
        return 'An error occurred during authentication.'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t('auth.signIn')}</CardTitle>
        <CardDescription>
          {t('auth.signInDescription')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {(urlError || authError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {authError || getErrorMessage(urlError!)}
            </AlertDescription>
          </Alert>
        )}

        {/* OAuth Providers */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              className={errors.email ? 'border-red-500' : ''}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                className={errors.password ? 'border-red-500' : ''}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="rounded border-gray-300"
              />
              <Label htmlFor="remember" className="text-sm">
                {t('auth.rememberMe')}
              </Label>
            </div>
            
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('auth.signIn')}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <p className="text-sm text-muted-foreground">
          {t('auth.dontHaveAccount')}{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:underline"
          >
            {t('auth.signUp')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default SignInForm