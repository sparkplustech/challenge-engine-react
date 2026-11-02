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

  test('should persist task completion after refresh', async ({ page }) => {
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await page.reload();
    await expect(page.getByRole('checkbox').first()).toBeChecked();
  });

  test('should persist newly added tasks after refresh', async ({ page }) => {
    await page.locator('#task-title').fill('Saved new task');
    await page.locator('#task-description').fill('Saved task details');
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.getByRole('heading', { name: 'Saved new task' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Saved new task' })).toBeVisible();
  });
});
