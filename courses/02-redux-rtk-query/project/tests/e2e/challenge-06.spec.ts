import { test, expect } from '@playwright/test'

test.describe('Challenge 06: RTK Query Setup - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/06-rtk-query-setup')
  })

  test('should load challenge 06 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 06')).toBeVisible()
    await expect(page.locator('text=RTK Query Setup')).toBeVisible()
  })

  test('should have challenge content', async ({ page }) => {
    await expect(page.locator('#challenge-06')).toBeVisible()
  })
})
