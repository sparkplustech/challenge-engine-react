import { test, expect } from '@playwright/test';

test.describe('Challenge 20: Error Boundaries - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/20-error-boundaries');
  });

  test('should display the task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
