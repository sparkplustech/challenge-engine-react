import { test, expect } from '@playwright/test';

test.describe('Challenge 17: Custom Hook useLocalStorage - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/17-custom-hook-uselocalstorage');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should persist task changes after refresh through the shared hook', async ({ page }) => {
    await page.locator('#task-title').fill('Hook persisted task');
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.getByRole('heading', { name: 'Hook persisted task' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Hook persisted task' })).toBeVisible();
  });
});
