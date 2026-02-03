import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 16: RTK Query with Next.js
 */

test.describe('Challenge 16: RTK Query with Next.js - E2E', () => {
  test('should load app', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load posts or data page', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });
});
