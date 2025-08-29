import crypto from 'crypto'
import jwt from 'jsonwebtoken'

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  const prefix = 'sk_'
  const key = crypto.randomBytes(32).toString('base64url')
  return prefix + key
}

/**
 * Generate JWT token for password reset
 */
export function generatePasswordResetToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'password_reset' },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '1h' }
  )
}

/**
 * Verify password reset JWT token
 */
export function verifyPasswordResetToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    if (decoded.type !== 'password_reset') {
      return null
    }
    return { userId: decoded.userId }
  } catch {
    return null
  }
}

/**
 * Generate TOTP secret for 2FA
 */
export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('base32')
}

/**
 * Generate backup codes for 2FA
 */
export function generateBackupCodes(): string[] {
  const codes = []
  for (let i = 0; i < 8; i++) {
    // Generate 8-digit backup codes
    const code = crypto.randomInt(10000000, 99999999).toString()
    codes.push(code)
  }
  return codes
}

/**
 * Hash backup codes for storage
 */
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  const bcrypt = await import('bcryptjs')
  const hashedCodes = []
  for (const code of codes) {
    const hashed = await bcrypt.hash(code, 10)
    hashedCodes.push(hashed)
  }
  return hashedCodes
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(code: string, hashedCode: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return await bcrypt.compare(code, hashedCode)
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>()
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return true
    }

    if (record.count >= this.maxAttempts) {
      return false
    }

    record.count++
    return true
  }

  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier)
    if (!record) return 0
    
    return Math.max(0, record.resetTime - Date.now())
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

/**
 * Password strength checker
 */
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push('Password should be at least 8 characters long')

  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Consider using a longer password')

  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')

  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Add numbers')

  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Add special characters (!@#$%^&*)')

  if (!/(.)\1{2,}/.test(password)) score += 1
  else feedback.push('Avoid repeating characters')

  const commonPatterns = [
    /123/,
    /abc/,
    /qwerty/i,
    /password/i,
    /admin/i
  ]
  
  if (!commonPatterns.some(pattern => pattern.test(password))) {
    score += 1
  } else {
    feedback.push('Avoid common patterns and words')
  }

  return {
    score,
    feedback,
    isStrong: score >= 6
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/script tags
    .slice(0, 1000) // Limit length
}

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(48).toString('base64url')
}

/**
 * Check if email is disposable/temporary
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    'temp-mail.org',
    'throwaway.email',
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  return disposableDomains.includes(domain)
}

/**
 * Validate password against user data to prevent common mistakes
 */
export function validatePasswordAgainstUserData(
  password: string, 
  userData: { email: string; firstName?: string; lastName?: string }
): boolean {
  const lowercasePassword = password.toLowerCase()
  const email = userData.email.toLowerCase()
  const firstName = userData.firstName?.toLowerCase() || ''
  const lastName = userData.lastName?.toLowerCase() || ''
  
  // Check if password contains email parts
  const emailParts = email.split('@')[0].split(/[._-]/)
  for (const part of emailParts) {
    if (part.length >= 3 && lowercasePassword.includes(part)) {
      return false
    }
  }
  
  // Check if password contains name
  if (firstName.length >= 3 && lowercasePassword.includes(firstName)) {
    return false
  }
  
  if (lastName.length >= 3 && lowercasePassword.includes(lastName)) {
    return false
  }
  
  return true
}