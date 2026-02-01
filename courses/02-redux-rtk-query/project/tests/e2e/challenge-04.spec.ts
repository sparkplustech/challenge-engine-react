import { test, expect } from '@playwright/test'

test.describe('Challenge 04: Multiple Slices - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/04-multiple-slices')
  })

  test('should load challenge 04 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 04')).toBeVisible()
    await expect(page.locator('text=Multiple Slices')).toBeVisible()
  })

  test('should have challenge content', async ({ page }) => {
    await expect(page.locator('#challenge-04')).toBeVisible()
  })
})
