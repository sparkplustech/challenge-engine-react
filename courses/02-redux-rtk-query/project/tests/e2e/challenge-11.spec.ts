import { test, expect } from '@playwright/test'

test.describe('Challenge 11: API and Local State - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/11-api-local-state')
  })

  test('should load challenge 11 page with PostsWithFilters', async ({ page }) => {
    await expect(page.locator('text=Challenge 11')).toBeVisible()
    await expect(page.getByTestId('posts-with-filters')).toBeVisible()
  })

  test('should have filter controls', async ({ page }) => {
    await expect(page.getByTestId('filter-controls')).toBeVisible()
  })
})
