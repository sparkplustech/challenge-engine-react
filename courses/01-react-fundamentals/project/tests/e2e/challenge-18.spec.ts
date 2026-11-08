import { test, expect } from '@playwright/test';

test.describe('Challenge 18: useReducer - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/18-usereducer-complex-state');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
