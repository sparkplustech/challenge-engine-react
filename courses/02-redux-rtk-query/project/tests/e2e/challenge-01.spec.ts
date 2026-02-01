import { test, expect } from '@playwright/test'

test.describe('Challenge 01: Store Setup - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/01-store-setup')
  })

  test('should load challenge 01 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 01')).toBeVisible()
    await expect(page.locator('text=Store Setup')).toBeVisible()
  })

  test('should have challenge content', async ({ page }) => {
    await expect(page.locator('#challenge-01')).toBeVisible()
  })
})
