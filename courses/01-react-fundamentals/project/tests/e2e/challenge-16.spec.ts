import { test, expect } from '@playwright/test';

test.describe('Challenge 16: Context API Theme - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/16-context-api-theme');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
