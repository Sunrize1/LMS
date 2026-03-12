import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
  })

  test('should navigate to profile page', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page.getByRole('heading', { name: /профиль/i })).toBeVisible()
  })

  test('should display user name and email', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page.getByText('user@test.com')).toBeVisible()
    await expect(page.getByLabel(/^имя$/i)).toHaveValue('Ivan')
    await expect(page.getByLabel(/^фамилия$/i)).toHaveValue('Ivanov')
  })

  test('should display form fields for editing', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page.getByLabel(/^имя$/i)).toBeVisible()
    await expect(page.getByLabel(/^фамилия$/i)).toBeVisible()
    await expect(page.getByLabel(/дата рождения/i)).toBeVisible()
  })

  test('should have save button', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page.getByRole('button', { name: /сохранить/i })).toBeVisible()
  })

  test('should have avatar upload functionality', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page.getByTestId('avatar-upload')).toBeAttached()
  })

  test('should display user initials when no avatar', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    await expect(page.getByText('II')).toBeVisible() // Ivan Ivanov
  })

  test('should allow editing name fields', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    const firstNameInput = page.getByLabel(/^имя$/i)
    await firstNameInput.clear()
    await firstNameInput.fill('UpdatedName')
    await expect(firstNameInput).toHaveValue('UpdatedName')
  })

  test('should submit profile update', async ({ page }) => {
    await page.getByRole('link', { name: /профиль/i }).click()
    const firstNameInput = page.getByLabel(/^имя$/i)
    await firstNameInput.clear()
    await firstNameInput.fill('UpdatedName')
    await page.getByRole('button', { name: /сохранить/i }).click()
    // Button should remain after save
    await expect(page.getByRole('button', { name: /сохранить/i })).toBeVisible()
  })
})
