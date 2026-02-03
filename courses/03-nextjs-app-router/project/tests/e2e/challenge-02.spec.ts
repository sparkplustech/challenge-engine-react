import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 02: Server and Client Components
 */

test.describe('Challenge 02: Server and Client Components - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have interactive element (button or link)', async ({ page }) => {
    const button = page.getByRole('button').first();
    const link = page.getByRole('link').first();
    const hasButton = await button.isVisible().catch(() => false);
    const hasLink = await link.isVisible().catch(() => false);
    expect(hasButton || hasLink).toBe(true);
  });
});
