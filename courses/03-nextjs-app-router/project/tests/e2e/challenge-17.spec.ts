import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 17: Fullstack Capstone
 */

test.describe('Challenge 17: Fullstack Capstone - E2E', () => {
  test('should load dynamic post detail page', async ({ page }) => {
    await page.goto('/posts/1');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have interactive content or form', async ({ page }) => {
    await page.goto('/posts/1');
    await page.waitForLoadState('domcontentloaded');
    const hasButton = await page.getByRole('button').first().isVisible().catch(() => false);
    const hasLink = await page.getByRole('link').first().isVisible().catch(() => false);
    const hasInput = await page.locator('input').first().isVisible().catch(() => false);
    expect(hasButton || hasLink || hasInput).toBe(true);
  });
});
