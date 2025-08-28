import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between pages", async ({ page }) => {
    // Start from the home page
    await page.goto("/");

    // Verify we're on the home page
    await expect(page).toHaveTitle(/Home/);

    // Navigate to about page (assuming you have a navigation menu)
    await page.click("text=About");

    // Verify URL changed to about page
    await expect(page).toHaveURL(/.*about/);

    // Verify about page content
    await expect(page.locator("h1")).toContainText("About");
  });

  test("should handle mobile navigation menu", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Start from the home page
    await page.goto("/");

    // Open mobile menu (assuming you have a hamburger button)
    await page.click('button[aria-label="Open menu"]');

    // Verify mobile menu is visible
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();

    // Click a link in the mobile menu
    await page.click("text=Contact");

    // Verify navigation worked
    await expect(page).toHaveURL(/.*contact/);
  });
});
