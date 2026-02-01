import { test, expect } from '@playwright/test'

test.describe('Challenge 08: Caching and Cache Tags - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/08-caching-refetch')
  })

  test('should load challenge 08 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 08')).toBeVisible()
    await expect(page.locator('text=Caching')).toBeVisible()
  })

  test('should have posts list or content', async ({ page }) => {
    await expect(page.getByTestId('posts-list')).toBeVisible()
  })
})
