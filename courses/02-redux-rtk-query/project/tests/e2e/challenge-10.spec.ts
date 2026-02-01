import { test, expect } from '@playwright/test'

test.describe('Challenge 10: Optimistic Updates - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/10-optimistic-updates')
  })

  test('should load challenge 10 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 10')).toBeVisible()
    await expect(page.locator('text=Optimistic')).toBeVisible()
  })

  test('should have challenge content', async ({ page }) => {
    await expect(page.locator('#challenge-10')).toBeVisible()
  })
})
