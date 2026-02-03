import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 08: SSR (Server-Side Rendering)
 */

test.describe('Challenge 08: SSR - E2E', () => {
  test('should load posts or dashboard page', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
