import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 12: Metadata and SEO
 */

test.describe('Challenge 12: Metadata and SEO - E2E', () => {
  test('should have page title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
