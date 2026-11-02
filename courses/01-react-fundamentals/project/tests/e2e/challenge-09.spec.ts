import { test, expect } from '@playwright/test';

test.describe('Challenge 09: Search Functionality - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/09-search-functionality');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display filter bar or search area', async ({ page }) => {
    await expect(page.locator('#filter-bar')).toBeVisible();
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('searches tasks and clear search restores the list', async ({ page }) => {
    const search = page.locator('#search-input');
    await search.fill('second');
    await expect(page.getByText('Second Task')).toBeVisible();
    await expect(page.getByText('First Task')).toHaveCount(0);

    await page.getByRole('button', { name: 'Clear search' }).click();
    await expect(search).toHaveValue('');
    await expect(page.getByText('First Task')).toBeVisible();
  });

  test('combines search with the status filter and shows empty state', async ({ page }) => {
    await page.locator('#search-input').fill('first');
    await page.getByRole('button', { name: 'Completed' }).click();
    await expect(page.locator('#filter-empty-message')).toContainText('No tasks found');
  });
});
