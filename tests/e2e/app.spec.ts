import { test, expect } from '@playwright/test';

test.describe('Application Health', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Strive/);
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check that no error messages are displayed
    await expect(page.locator('[role="alert"]')).not.toBeVisible();
  });
  
  test('health API endpoint works', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });
  
  test('database health check works', async ({ request }) => {
    const response = await request.get('/api/health/database');
    
    // Should return 200 if database is connected, or specific error status
    expect([200, 500]).toContain(response.status());
    
    const data = await response.json();
    expect(data).toHaveProperty('connected');
  });
});

test.describe('Navigation', () => {
  test('can navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to blog (if it exists)
    const blogLink = page.locator('a[href*="/blog"]').first();
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await expect(page).toHaveURL(/\/blog/);
    }
    
    // Navigate back to home
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
  
  test('no console errors on homepage', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known harmless errors
    const significantErrors = consoleErrors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('google-analytics') &&
      !error.includes('gtag')
    );
    
    expect(significantErrors).toHaveLength(0);
  });
});

test.describe('Responsive Design', () => {
  test('mobile layout works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that mobile navigation works
    const mobileMenuButton = page.locator('[aria-label*="menu"], [aria-label*="navigation"]').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Mobile menu should be visible after clicking
      await expect(page.locator('nav')).toBeVisible();
    }
  });
  
  test('desktop layout works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Navigation should be visible without clicking
    await expect(page.locator('nav')).toBeVisible();
  });
});
