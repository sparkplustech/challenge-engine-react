import { test, expect } from '@playwright/test';

test.describe('Challenge 23: useRef - Focus Management - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/23-useref-focus-management');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display the search input', async ({ page }) => {
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('search input should exist and be visible', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('type', 'text');
  });
});
