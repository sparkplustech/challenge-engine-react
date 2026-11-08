import { test, expect } from '@playwright/test';

test.describe('Challenge 11: useEffect Debounced Search - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/11-useeffect-debounced-search');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
