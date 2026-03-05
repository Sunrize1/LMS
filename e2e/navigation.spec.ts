import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent')
    await expect(page.getByText('404')).toBeVisible()
  })

  test('should redirect root to /classes', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/(login|classes)/)
  })
})
