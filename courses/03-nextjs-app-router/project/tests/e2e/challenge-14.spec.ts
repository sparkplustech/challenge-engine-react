import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 14: Search and Pagination
 */

test.describe('Challenge 14: Search and Pagination - E2E', () => {
  test('should load posts page with search params', async ({ page }) => {
    await page.goto('/posts?page=1');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
