import { test, expect } from '@playwright/test'

test.describe('Challenge 02: First Slice - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/02-first-slice')
  })

  test('should load challenge 02 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 02')).toBeVisible()
    await expect(page.locator('text=First Slice')).toBeVisible()
  })

  test('should have challenge content', async ({ page }) => {
    await expect(page.locator('#challenge-02')).toBeVisible()
  })
})
