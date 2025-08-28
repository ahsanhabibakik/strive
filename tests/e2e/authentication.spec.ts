import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('displays signin page correctly', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Check signin form elements
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByText(/welcome back to strive/i)).toBeVisible()
    
    // Check Google signin button
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
    
    // Check credentials form
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /^sign in$/i })).toBeVisible()
  })

  test('validates empty form submission', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const signinButton = page.getByRole('button', { name: /^sign in$/i })
    await signinButton.click()
    
    // Check HTML5 validation (required fields)
    const emailInput = page.getByPlaceholder(/email/i)
    const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(isEmailInvalid).toBe(true)
  })

  test('validates email format', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const emailInput = page.getByPlaceholder(/email/i)
    const passwordInput = page.getByPlaceholder(/password/i)
    const signinButton = page.getByRole('button', { name: /^sign in$/i })
    
    await emailInput.fill('invalid-email')
    await passwordInput.fill('password123')
    await signinButton.click()
    
    // Check HTML5 email validation
    const isEmailInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(isEmailInvalid).toBe(true)
  })

  test('handles invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const emailInput = page.getByPlaceholder(/email/i)
    const passwordInput = page.getByPlaceholder(/password/i)
    const signinButton = page.getByRole('button', { name: /^sign in$/i })
    
    await emailInput.fill('test@example.com')
    await passwordInput.fill('wrongpassword')
    await signinButton.click()
    
    // Wait for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 5000 })
  })

  test('redirects unauthenticated users to signin', async ({ page }) => {
    // Try to access a protected route (if any exist)
    await page.goto('/dashboard')
    
    // Should redirect to signin or show signin form
    await expect(page).toHaveURL(/auth\/signin/)
  })

  test('shows loading state during signin', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const emailInput = page.getByPlaceholder(/email/i)
    const passwordInput = page.getByPlaceholder(/password/i)
    const signinButton = page.getByRole('button', { name: /^sign in$/i })
    
    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')
    
    // Click and immediately check for loading state
    await signinButton.click()
    await expect(page.getByText(/signing in/i)).toBeVisible({ timeout: 1000 })
  })

  test('google signin button is functional', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const googleButton = page.getByRole('button', { name: /continue with google/i })
    
    // Check that button is clickable and has proper styling
    await expect(googleButton).toBeVisible()
    await expect(googleButton).toBeEnabled()
    
    // Note: We don't actually test the OAuth flow as it requires real credentials
    // In a real test environment, you might mock the OAuth response
  })

  test('signup link navigation works', async ({ page }) => {
    await page.goto('/auth/signin')
    
    const signupLink = page.getByRole('link', { name: /sign up/i })
    if (await signupLink.count() > 0) {
      await signupLink.click()
      await expect(page).toHaveURL(/auth\/signup/)
    }
  })

  test('error page displays correctly', async ({ page }) => {
    await page.goto('/auth/error?error=Configuration')
    
    await expect(page.getByRole('heading', { name: /authentication error/i })).toBeVisible()
    await expect(page.getByText(/problem with the server configuration/i)).toBeVisible()
    
    // Check action buttons
    await expect(page.getByRole('link', { name: /try again/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /go home/i })).toBeVisible()
  })
})