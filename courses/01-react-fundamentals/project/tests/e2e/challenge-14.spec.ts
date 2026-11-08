import { test, expect } from '@playwright/test';

test.describe('Challenge 14: Task Statistics Dashboard - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/14-task-statistics-dashboard');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display stats panel when implemented', async ({ page }) => {
    const stats = page.locator('#stats-panel');
    await expect(stats).toBeVisible();
  });
});
