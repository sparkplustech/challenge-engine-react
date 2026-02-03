import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 09: Server Actions and Revalidation
 */

test.describe('Challenge 09: Server Actions and Revalidation - E2E', () => {
  test('should have form or button on posts page', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('domcontentloaded');
    const hasForm = await page.locator('form').first().isVisible().catch(() => false);
    const hasButton = await page.getByRole('button').first().isVisible().catch(() => false);
    expect(hasForm || hasButton).toBe(true);
  });
});
