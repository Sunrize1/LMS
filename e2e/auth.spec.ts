import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page by default', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /вход/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/пароль/i)).toBeVisible()
  })

  test('should have link to register page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: /регистрация/i })).toBeVisible()
  })

  test('should show register page', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /регистрация/i })).toBeVisible()
    await expect(page.getByLabel(/имя/i)).toBeVisible()
  })

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/classes')
    await expect(page).toHaveURL(/\/login/)
  })
})
