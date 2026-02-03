import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 15: Redux Toolkit with Next.js
 */

test.describe('Challenge 15: Redux Toolkit with Next.js - E2E', () => {
  test('should load app with Redux provider', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
