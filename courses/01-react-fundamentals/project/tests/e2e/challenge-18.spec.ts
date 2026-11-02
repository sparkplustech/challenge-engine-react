import { test, expect } from '@playwright/test';

test.describe('Challenge 18: useReducer - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/18-usereducer-complex-state');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should add, toggle, edit, delete, and persist reducer-managed tasks', async ({ page }) => {
    await page.getByLabel('Title').fill('Reducer task');
    await page.getByLabel('Description').fill('Dispatch updates');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const task = page.locator('#task-card').last();
    await expect(task).toBeVisible();
    await task.getByRole('checkbox').check();
    await expect(task).toHaveAttribute('data-completed', 'true');

    await task.getByRole('button', { name: 'Edit' }).click();
    await task.getByRole('textbox', { name: 'Edit title' }).fill('Updated reducer task');
    await task.getByRole('button', { name: 'Save' }).click();
    await expect(task.getByRole('heading', { name: 'Updated reducer task' })).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await task.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Updated reducer task')).not.toBeVisible();

    await expect.poll(async () => page.evaluate(() => {
      const tasks = JSON.parse(localStorage.getItem('task-app-tasks') ?? '[]');
      return tasks.some((item: { title: string }) => item.title === 'Updated reducer task');
    })).toBe(false);
  });
});
