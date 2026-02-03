import { test, expect } from '@playwright/test'

test.describe('Challenge 13: Query with Parameters - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/13-query-parameters')
  })

  test('should load challenge 13 page with content', async ({ page }) => {
    await expect(page.locator('#challenge-13')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Challenge 13')).toBeVisible()
  })

  test('should show post detail area', async ({ page }) => {
    await expect(page.getByTestId('post-detail')).toBeVisible({ timeout: 10000 })
  })
})
