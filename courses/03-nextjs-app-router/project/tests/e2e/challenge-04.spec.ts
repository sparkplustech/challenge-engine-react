import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Challenge 04: API Route Handlers
 */

test.describe('Challenge 04: API Route Handlers - E2E', () => {
  test('should have API route that returns JSON', async ({ request }) => {
    const response = await request.get('/api/posts');
    expect(response.ok()).toBe(true);
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('json');
  });
});
