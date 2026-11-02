import { test, expect } from '@playwright/test';

test.describe('Challenge 12: Categories and Tags - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/12-categories-and-tags');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display task form', async ({ page }) => {
    await expect(page.locator('#task-title')).toBeVisible();
  });

  test('should add categorized tasks with tags and filter by category', async ({ page }) => {
    await page.locator('#task-title').fill('Tagged work');
    await page.locator('#task-category-input').selectOption('Work');
    await page.locator('#task-tags-input').fill('urgent, planning');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const task = page.locator('#task-card').filter({ hasText: 'Tagged work' });
    await expect(task.locator('#task-category')).toHaveText('Work');
    await expect(task.locator('#task-tags [data-tag="urgent"]')).toBeVisible();
    await expect(task.locator('#task-tags [data-tag="planning"]')).toBeVisible();

    await page.locator('#category-filter').selectOption('Personal');
    await expect(page.getByRole('heading', { name: 'Tagged work' })).toHaveCount(0);
    await page.locator('#category-filter').selectOption('Work');
    await expect(page.getByRole('heading', { name: 'Tagged work' })).toBeVisible();
  });

  test('should persist task category and tags after refresh', async ({ page }) => {
    await page.locator('#task-title').fill('Persistent work');
    await page.locator('#task-category-input').selectOption('Work');
    await page.locator('#task-tags-input').fill('saved, review');
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.reload();

    const task = page.locator('#task-card').filter({ hasText: 'Persistent work' });
    await expect(task.locator('#task-category')).toHaveText('Work');
    await expect(task.locator('#task-tags [data-tag="saved"]')).toBeVisible();
    await expect(task.locator('#task-tags [data-tag="review"]')).toBeVisible();
  });
});
