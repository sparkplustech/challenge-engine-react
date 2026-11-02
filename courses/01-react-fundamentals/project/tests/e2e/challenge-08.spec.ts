import { test, expect } from '@playwright/test';

test.describe('Challenge 08: Task Editing - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/08-task-editing');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display task form when showForm is true', async ({ page }) => {
    await expect(page.locator('#task-title')).toBeVisible();
  });

  test('should save an edited task', async ({ page }) => {
    const firstTask = page.locator('#task-card').first();
    await firstTask.getByRole('button', { name: 'Edit' }).click();
    await firstTask.getByRole('textbox', { name: 'Edit title' }).fill('Updated task');
    await firstTask.getByRole('button', { name: 'Save' }).click();
    await expect(firstTask.getByRole('heading', { name: 'Updated task' })).toBeVisible();
  });

  test('should keep edit mode open when title is empty and cancel changes', async ({ page }) => {
    const firstTask = page.locator('#task-card').first();
    await firstTask.getByRole('button', { name: 'Edit' }).click();
    const title = firstTask.getByRole('textbox', { name: 'Edit title' });
    await title.fill('   ');
    await firstTask.getByRole('button', { name: 'Save' }).click();
    await expect(title).toBeVisible();

    await firstTask.getByRole('button', { name: 'Cancel' }).click();
    await expect(firstTask.getByRole('heading', { name: 'First Task' })).toBeVisible();
  });
});
