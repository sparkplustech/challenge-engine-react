import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 05: Loading and Streaming
 */

test.describe('Challenge 05: Loading and Streaming - E2E', () => {
  test('should load posts page', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
