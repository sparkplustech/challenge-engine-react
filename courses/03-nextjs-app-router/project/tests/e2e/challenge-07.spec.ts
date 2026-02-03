import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 07: Static and Dynamic Rendering
 */

test.describe('Challenge 07: Static and Dynamic Rendering - E2E', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load posts page', async ({ page }) => {
    await page.goto('/posts');
    await expect(page.locator('body')).toBeVisible();
  });
});
