import { test, expect } from '@playwright/test';

test.describe('Challenge 13: Due Dates and Sorting - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/13-due-dates-and-sorting');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
