import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 01: App Router, Pages, and Layout
 */

test.describe('Challenge 01: App Router, Pages, and Layout - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page', async ({ page }) => {
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  test('should have link to about and navigate to about page', async ({ page }) => {
    const aboutLink = page.getByRole('link', { name: /about/i }).first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await page.waitForURL(/about/i);
    expect(page.url()).toContain('about');
  });

  test('should have at least one navigation link', async ({ page }) => {
    const links = page.locator('a[href*="/"]');
    expect(await links.count()).toBeGreaterThan(0);
  });
});
