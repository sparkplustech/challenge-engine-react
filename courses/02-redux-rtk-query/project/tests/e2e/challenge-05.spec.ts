import { test, expect } from '@playwright/test'

test.describe('Challenge 05: Async Thunks - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/05-async-thunks')
  })

  test('should load challenge 05 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 05')).toBeVisible()
    await expect(page.locator('text=Async Thunks')).toBeVisible()
  })

  test('should have challenge content', async ({ page }) => {
    await expect(page.locator('#challenge-05')).toBeVisible()
  })
})
