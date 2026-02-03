import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 10: Caching and Revalidating
 */

test.describe('Challenge 10: Caching and Revalidating - E2E', () => {
  test('should load posts page', async ({ page }) => {
    await page.goto('/posts');
    await expect(page.locator('body')).toBeVisible();
  });
});
