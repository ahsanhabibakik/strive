'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Check, X, Loader2, KeyRound } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { showToast } from '@/lib/utils/toast'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  
  const [formData, setFormData] = useState<ResetPasswordForm>({
    password: '',
    confirmPassword: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<ResetPasswordForm & { submit: string }>>({})
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }
    
    Object.values(checks).forEach(check => {
      if (check) strength += 20
    })
    
    return { strength, checks }
  }

  const { strength: passwordStrength, checks: passwordChecks } = calculatePasswordStrength(formData.password)

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500'
    if (passwordStrength < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak'
    if (passwordStrength < 80) return 'Good'
    return 'Strong'
  }

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()
        setIsTokenValid(response.ok)
        
        if (!response.ok) {
          setErrors({ submit: data.message || 'Invalid or expired reset token' })
        }
      } catch (error) {
        console.error('Token verification error:', error)
        setIsTokenValid(false)
        setErrors({ submit: 'Failed to verify reset token' })
      }
    }

    if (token) {
      verifyToken()
    } else {
      setIsTokenValid(false)
      setErrors({ submit: 'Reset token is required' })
    }
  }, [token])

  const validateForm = () => {
    try {
      resetPasswordSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<ResetPasswordForm & { submit: string }> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ResetPasswordForm] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleInputChange = (field: keyof ResetPasswordForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !isTokenValid) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.message || 'Failed to reset password' })
        return
      }

      // Success
      setIsSuccess(true)
      showToast.success(t('auth.passwordResetSuccess'))
      
      // Redirect to sign in after a short delay
      setTimeout(() => {
        router.push('/auth/signin?message=password-reset-success')
      }, 2000)
      
    } catch (error) {
      console.error('Reset password error:', error)
      setErrors({ submit: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while verifying token
  if (isTokenValid === null) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
            <p className="text-muted-foreground">Verifying reset token...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Invalid token state
  if (isTokenValid === false) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Invalid Reset Link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {errors.submit || 'The reset link may have expired or been used already.'}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Request a new reset link
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been successfully reset. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Redirecting you to sign in page...
          </p>
        </CardContent>

        <CardFooter className="text-center">
          <Link
            href="/auth/signin"
            className="text-primary hover:underline"
          >
            Continue to sign in
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Reset password form
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {errors.submit && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="password">New {t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                className={errors.password ? 'border-red-500' : ''}
                autoComplete="new-password"
                autoFocus
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Password strength:
                  </span>
                  <span className={`text-xs font-medium ${
                    passwordStrength < 40 ? 'text-red-600' :
                    passwordStrength < 80 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`h-2 ${getPasswordStrengthColor()}`}
                />
                
                {/* Password Requirements */}
                <div className="space-y-1">
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'One uppercase letter' },
                    { key: 'lowercase', text: 'One lowercase letter' },
                    { key: 'number', text: 'One number' },
                    { key: 'special', text: 'One special character' },
                  ].map(({ key, text }) => (
                    <div key={key} className="flex items-center space-x-2">
                      {passwordChecks[key as keyof typeof passwordChecks] ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <X className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        passwordChecks[key as keyof typeof passwordChecks] 
                          ? 'text-green-600' 
                          : 'text-muted-foreground'
                      }`}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={isLoading}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || passwordStrength < 80}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center">
        <Link
          href="/auth/signin"
          className="text-primary hover:underline text-sm"
        >
          Remember your password? Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ResetPasswordForm