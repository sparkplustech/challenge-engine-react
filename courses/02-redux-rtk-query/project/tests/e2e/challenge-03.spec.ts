import { test, expect } from '@playwright/test'

test.describe('Challenge 03: Reading and Dispatching - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/03-reading-dispatching')
  })

  test('should load challenge 03 page with CounterView', async ({ page }) => {
    await expect(page.locator('text=Challenge 03')).toBeVisible()
    await expect(page.getByTestId('counter-view')).toBeVisible()
  })

  test('should have increment and decrement buttons', async ({ page }) => {
    await expect(page.getByTestId('increment-btn')).toBeVisible()
    await expect(page.getByTestId('decrement-btn')).toBeVisible()
  })

  test('should show counter value', async ({ page }) => {
    await expect(page.getByTestId('counter-value')).toBeVisible()
  })
})
