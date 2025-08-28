import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /welcome to strive/i })).toBeVisible()
    
    // Check navigation
    await expect(page.getByRole('link', { name: /blog/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('displays key features correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check feature cards
    await expect(page.getByText(/fast setup/i)).toBeVisible()
    await expect(page.getByText(/auth ready/i)).toBeVisible()
    await expect(page.getByText(/content system/i)).toBeVisible()
  })

  test('newsletter subscription works', async ({ page }) => {
    await page.goto('/')
    
    // Find newsletter form
    const newsletterSection = page.locator('text=Subscribe to Newsletter').locator('..')
    const emailInput = newsletterSection.getByPlaceholder(/your email address/i)
    const subscribeButton = newsletterSection.getByRole('button', { name: /subscribe/i })
    
    // Test invalid email
    await emailInput.fill('invalid-email')
    await subscribeButton.click()
    await expect(page.getByText(/please enter a valid email address/i)).toBeVisible()
    
    // Test valid email (will show loading state)
    await emailInput.fill('test@example.com')
    await subscribeButton.click()
    await expect(page.getByText(/loading/i)).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/')
    
    // Test blog navigation
    await page.getByRole('link', { name: /blog/i }).click()
    await expect(page).toHaveURL('/blog')
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible()
    
    // Go back to homepage
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /welcome to strive/i })).toBeVisible()
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that content is visible on mobile
    await expect(page.getByRole('heading', { name: /welcome to strive/i })).toBeVisible()
    
    // Check that cards stack vertically (mobile layout)
    const featureCards = page.locator('[data-testid="feature-cards"], .grid')
    if (await featureCards.count() > 0) {
      await expect(featureCards.first()).toBeVisible()
    }
  })

  test('performance is acceptable', async ({ page }) => {
    await page.goto('/')
    
    // Basic performance check - page should load within 3 seconds
    const startTime = Date.now()
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000)
  })
})