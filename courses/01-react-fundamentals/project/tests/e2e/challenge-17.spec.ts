import { test, expect } from '@playwright/test';

test.describe('Challenge 17: Custom Hook useLocalStorage - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/17-custom-hook-uselocalstorage');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
