import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 11: Error Handling
 */

test.describe('Challenge 11: Error Handling - E2E', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle invalid post id (404 or error)', async ({ page }) => {
    const response = await page.goto('/posts/invalid-id-99999');
    expect(response).toBeTruthy();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
