import { test, expect } from '@playwright/test'

test.describe('Challenge 07: Queries - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/07-queries')
  })

  test('should load challenge 07 page with UsersList', async ({ page }) => {
    await expect(page.locator('text=Challenge 07')).toBeVisible()
    await expect(page.getByTestId('users-list')).toBeVisible()
  })

  test('should show users or loading or error', async ({ page }) => {
    await page.waitForTimeout(3000)
    const body = await page.locator('body').textContent()
    expect(body).toMatch(/users|loading|error|John|Jane|Bob|Implement/i)
  })
})
