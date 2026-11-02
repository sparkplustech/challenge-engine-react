import { test, expect } from '@playwright/test';

test.describe('Challenge 13: Due Dates and Sorting - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/13-due-dates-and-sorting');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should add and display task due date', async ({ page }) => {
    await page.locator('#task-title').fill('Date task');
    await page.locator('#task-due-date-input').fill('2026-11-10');
    await page.getByRole('button', { name: 'Add Task' }).click();

    const task = page.locator('#task-card').filter({ hasText: 'Date task' });
    await expect(task.locator('#task-due-date')).toContainText('11/10/2026');
  });

  test('should expose due-date sort option', async ({ page }) => {
    await expect(page.locator('#sort-order')).toContainText('Due Date (Soonest First)');
  });
});
