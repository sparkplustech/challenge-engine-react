import { test, expect } from '@playwright/test'

test.describe('Challenge 10: Optimistic Updates - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/10-optimistic-updates')
  })

  test('should load challenge 10 page with content', async ({ page }) => {
    await expect(page.locator('#challenge-10')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Challenge 10')).toBeVisible()
  })
})
