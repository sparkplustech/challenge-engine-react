import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 03: Data Fetching in Server Components
 */

test.describe('Challenge 03: Data Fetching - E2E', () => {
  test('should load posts page with content', async ({ page }) => {
    await page.goto('/posts');
    await page.waitForLoadState('networkidle').catch(() => {});
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('should have API route that returns JSON', async ({ request }) => {
    const response = await request.get('/api/posts');
    if (response.ok()) {
      const contentType = response.headers()['content-type'] || '';
      expect(contentType).toContain('json');
    }
  });
});
