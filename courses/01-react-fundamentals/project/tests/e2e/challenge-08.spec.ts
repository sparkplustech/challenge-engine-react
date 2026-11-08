import { test, expect } from '@playwright/test';

test.describe('Challenge 08: Task Editing - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/08-task-editing');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display task form when showForm is true', async ({ page }) => {
    await expect(page.locator('#task-title')).toBeVisible();
  });
});
