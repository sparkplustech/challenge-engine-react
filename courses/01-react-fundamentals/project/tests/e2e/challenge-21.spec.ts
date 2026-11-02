import { test, expect } from '@playwright/test';

test.describe('Challenge 21: React Router - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/21-react-router');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('task detail route should be reachable', async ({ page }) => {
    await page.goto('/challenge/21-react-router/task/1');
    await expect(page.locator('#task-detail-page')).toBeVisible();
  });

  test('back button should exist on task detail page', async ({ page }) => {
    await page.goto('/challenge/21-react-router/task/1');
    await expect(page.locator('#task-detail-back')).toBeVisible();
  });

  test('task title opens detail page and back returns to the list', async ({ page }) => {
    await page.getByRole('link', { name: 'First Task' }).click();
    await expect(page).toHaveURL(/\/challenge\/21-react-router\/task\/1$/);
    await expect(page.getByRole('heading', { name: 'First Task' })).toBeVisible();
    await page.getByRole('button', { name: 'Back to list' }).click();
    await expect(page).toHaveURL(/\/challenge\/21-react-router$/);
    await expect(page.locator('#task-list')).toBeVisible();
  });
});
