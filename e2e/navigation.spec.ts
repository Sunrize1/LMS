import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Navigation', () => {
  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent')
    await expect(page.getByText('404')).toBeVisible()
  })

  test('should redirect root to /classes or /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/(login|classes)/)
  })

  test('should show navbar with links when authenticated', async ({ page }) => {
    await loginViaUI(page)
    await expect(page.getByRole('link', { name: 'LMS' })).toBeVisible()
    await expect(page.getByRole('link', { name: /классы/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /профиль/i })).toBeVisible()
  })

  test('should show user name in navbar', async ({ page }) => {
    await loginViaUI(page)
    await expect(page.getByText(/ivan ivanov/i)).toBeVisible()
  })

  test('should show logout button', async ({ page }) => {
    await loginViaUI(page)
    await expect(page.getByRole('button', { name: /выйти/i })).toBeVisible()
  })

  test('should navigate between pages via navbar', async ({ page }) => {
    await loginViaUI(page)
    // Go to profile
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page).toHaveURL(/\/profile/)
    // Go back to classes
    await page.getByRole('link', { name: /классы/i }).click()
    await expect(page).toHaveURL(/\/classes/)
  })

  test('should navigate back from class detail to class list', async ({ page }) => {
    await loginViaUI(page)
    await page.getByText('Math 101').click()
    await expect(page).toHaveURL(/\/classes\/cls-1/)
    await page.getByRole('link', { name: /классы/i }).click()
    await expect(page).toHaveURL(/\/classes/)
  })
})
