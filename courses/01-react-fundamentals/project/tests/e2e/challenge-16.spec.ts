import { test, expect } from '@playwright/test';

test.describe('Challenge 16: Context API Theme - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/16-context-api-theme');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should toggle and persist dark theme', async ({ page }) => {
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  });
});
