import { test, expect } from '@playwright/test';

test.describe('Challenge 10: useEffect Local Storage - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/10-useeffect-local-storage');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display task count', async ({ page }) => {
    await expect(page.locator('#task-count')).toBeVisible();
  });
});
