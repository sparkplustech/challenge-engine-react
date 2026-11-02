import { test, expect } from '@playwright/test';

test.describe('Challenge 11: useEffect Debounced Search - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/11-useeffect-debounced-search');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should delay search results and show searching indicator', async ({ page }) => {
    await page.locator('#search-input').fill('second');
    await expect(page.locator('#searching-indicator')).toHaveText('Searching...');
    await expect(page.getByRole('heading', { name: 'Second Task' })).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#searching-indicator')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'First Task' })).toHaveCount(0);
  });
});
