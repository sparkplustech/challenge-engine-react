import { test, expect } from '@playwright/test';

test.describe('Challenge 12: Categories and Tags - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/12-categories-and-tags');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display task form', async ({ page }) => {
    await expect(page.locator('#task-title')).toBeVisible();
  });
});
