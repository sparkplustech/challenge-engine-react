import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 13: Images and Fonts
 */

test.describe('Challenge 13: Images and Fonts - E2E', () => {
  test('should load home page with content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
