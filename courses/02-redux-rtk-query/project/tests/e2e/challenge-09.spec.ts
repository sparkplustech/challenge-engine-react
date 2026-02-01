import { test, expect } from '@playwright/test'

test.describe('Challenge 09: Mutations - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/09-mutations')
  })

  test('should load challenge 09 page with AddPostForm', async ({ page }) => {
    await expect(page.locator('text=Challenge 09')).toBeVisible()
    await expect(page.getByTestId('add-post-form')).toBeVisible()
  })

  test('should have add post submit button', async ({ page }) => {
    await expect(page.getByTestId('add-post-submit')).toBeVisible()
  })
})
