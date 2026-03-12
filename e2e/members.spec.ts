import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Members', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
  })

  test('should navigate to members page', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    await expect(page.getByRole('heading', { name: /участники/i })).toBeVisible()
  })

  test('should display member list', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    await expect(page.getByText('Ivan Ivanov')).toBeVisible()
    await expect(page.getByText('Petr Petrov')).toBeVisible()
  })

  test('should display member emails', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    await expect(page.getByText('ivan@test.com')).toBeVisible()
    await expect(page.getByText('petr@test.com')).toBeVisible()
  })

  test('should show role badge for owner member', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    await expect(page.getByText('Владелец')).toBeVisible()
  })

  test('should show role selector for non-owner members when user is OWNER', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    const roleSelect = page.getByLabel(/роль petr petrov/i)
    await expect(roleSelect).toBeVisible()
    await expect(roleSelect).toHaveValue('STUDENT')
  })

  test('should show remove button for non-self members when OWNER', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    const removeButtons = page.getByRole('button', { name: /удалить/i })
    await expect(removeButtons).toHaveCount(1)
  })

  test('should allow changing member role', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /участники/i }).click()
    const roleSelect = page.getByLabel(/роль petr petrov/i)
    await roleSelect.selectOption('TEACHER')
    // Select should still be present after role change
    await expect(roleSelect).toBeVisible()
  })
})
