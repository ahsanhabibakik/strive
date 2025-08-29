'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Download, Shield, Smartphone, Check, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { showToast } from '@/lib/utils/toast'

interface TwoFactorSetupProps {
  isEnabled: boolean
  onStatusChange: (enabled: boolean) => void
}

interface SetupData {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export function TwoFactorSetup({ isEnabled, onStatusChange }: TwoFactorSetupProps) {
  const { t } = useTranslation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [step, setStep] = useState<'initial' | 'setup' | 'verify' | 'backup' | 'complete'>('initial')
  const [error, setError] = useState('')
  
  const backupCodesRef = useRef<HTMLDivElement>(null)

  const startSetup = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to start 2FA setup')
      }

      setSetupData(data)
      setStep('setup')
    } catch (error) {
      console.error('2FA setup error:', error)
      setError(error instanceof Error ? error.message : 'Setup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: verificationCode,
          secret: setupData?.secret,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed')
      }

      setBackupCodes(data.backupCodes)
      setStep('backup')
      showToast.success('2FA enabled successfully!')
      
    } catch (error) {
      console.error('2FA verification error:', error)
      setError(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const disable2FA = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to disable 2FA')
      }

      onStatusChange(false)
      setStep('initial')
      setSetupData(null)
      setVerificationCode('')
      setBackupCodes([])
      showToast.success('2FA disabled successfully')
      
    } catch (error) {
      console.error('2FA disable error:', error)
      setError(error instanceof Error ? error.message : 'Failed to disable 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  const regenerateBackupCodes = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate backup codes')
      }

      setBackupCodes(data.backupCodes)
      setShowBackupCodes(true)
      showToast.success('New backup codes generated')
      
    } catch (error) {
      console.error('Backup codes error:', error)
      showToast.error('Failed to generate backup codes')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast.success('Copied to clipboard')
    } catch (error) {
      console.error('Copy error:', error)
      showToast.error('Failed to copy')
    }
  }

  const downloadBackupCodes = () => {
    const content = [
      'Two-Factor Authentication Backup Codes',
      '==========================================',
      '',
      'Store these codes in a safe place. Each code can only be used once.',
      '',
      ...backupCodes.map((code, index) => `${index + 1}. ${code}`),
      '',
      'Generated on: ' + new Date().toLocaleString(),
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '2fa-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const completeSetup = () => {
    setStep('complete')
    onStatusChange(true)
  }

  // Initial state - 2FA not enabled
  if (step === 'initial' && !isEnabled) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-muted-foreground" />
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Badge variant="outline">Disabled</Badge>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Two-factor authentication is not enabled for your account. 
                Enable it to add an extra layer of security.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Benefits of 2FA:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Protects against password breaches</li>
              <li>• Prevents unauthorized access</li>
              <li>• Works with popular authenticator apps</li>
              <li>• Includes backup recovery codes</li>
            </ul>
          </div>

          <Button onClick={startSetup} disabled={isLoading}>
            <Shield className="w-4 h-4 mr-2" />
            {isLoading ? 'Setting up...' : 'Enable 2FA'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Setup state - show QR code and manual entry
  if (step === 'setup' && setupData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Step 1: Add your account to an authenticator app
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCodeSVG
                value={setupData.qrCodeUrl}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Scan with your authenticator app:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Google Authenticator</li>
              <li>• Authy</li>
              <li>• Microsoft Authenticator</li>
              <li>• 1Password</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Or enter this code manually:</h4>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                {setupData.secret}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(setupData.secret)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => setStep('verify')} className="flex-1">
              <Smartphone className="w-4 h-4 mr-2" />
              Continue
            </Button>
            <Button variant="outline" onClick={() => setStep('initial')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Verification state
  if (step === 'verify') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify Your Setup</CardTitle>
          <CardDescription>
            Step 2: Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setVerificationCode(value)
                setError('')
              }}
              disabled={isLoading}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={verifyAndEnable} 
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1"
            >
              {isLoading ? 'Verifying...' : 'Verify & Enable'}
            </Button>
            <Button variant="outline" onClick={() => setStep('setup')}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Backup codes state
  if (step === 'backup' && backupCodes.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">2FA Enabled Successfully!</CardTitle>
          <CardDescription>
            Step 3: Save your backup codes in a secure location
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Save these backup codes now. They're your only way to 
              access your account if you lose your authenticator device.
            </AlertDescription>
          </Alert>

          <div ref={backupCodesRef} className="space-y-3">
            <h4 className="text-sm font-medium">Backup Codes:</h4>
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={code} className="flex justify-between items-center">
                    <span>{index + 1}. {code}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadBackupCodes}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <Button onClick={completeSetup} className="w-full">
            <Check className="w-4 h-4 mr-2" />
            I've Saved My Backup Codes
          </Button>
        </CardContent>
      </Card>
    )
  }

  // 2FA enabled state
  if (isEnabled) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Your account is protected with 2FA
                </CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" />
              Enabled
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication is active on your account. You'll need to enter 
            a code from your authenticator app when signing in.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showBackupCodes && backupCodes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">New Backup Codes:</h4>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={code}>
                      {index + 1}. {code}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadBackupCodes}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={regenerateBackupCodes}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {isLoading ? 'Generating...' : 'Generate New Backup Codes'}
            </Button>
            <Button
              variant="destructive"
              onClick={disable2FA}
              disabled={isLoading}
            >
              {isLoading ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Security tip:</strong> Keep your backup codes in a secure location 
              separate from your authenticator device. Each code can only be used once.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return null
}

export default TwoFactorSetup