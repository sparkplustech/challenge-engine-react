import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 06: Dynamic Routes
 */

test.describe('Challenge 06: Dynamic Routes - E2E', () => {
  test('should load dynamic post page', async ({ page }) => {
    await page.goto('/posts/1');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
