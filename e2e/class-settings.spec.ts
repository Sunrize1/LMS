import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Class Settings', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
  })

  test('should navigate to class settings page', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    await expect(page.getByRole('heading', { name: /настройки класса/i })).toBeVisible()
  })

  test('should display class name input pre-filled', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    await expect(page.getByLabel(/название/i)).toHaveValue('Math 101')
  })

  test('should display invite code', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    await expect(page.getByText('ABCD1234')).toBeVisible()
  })

  test('should have copy and refresh code buttons', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    await expect(page.getByRole('button', { name: /скопировать/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /обновить код/i })).toBeVisible()
  })

  test('should allow renaming the class', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    const input = page.getByLabel(/название/i)
    await input.clear()
    await input.fill('Updated Class Name')
    await page.getByRole('button', { name: /сохранить/i }).click()
    // Should remain on settings page after save
    await expect(page.getByRole('heading', { name: /настройки класса/i })).toBeVisible()
  })

  test('should show delete button only for OWNER', async ({ page }) => {
    // Physics 201 is cls-2 = OWNER
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    await expect(page.getByRole('button', { name: /удалить класс/i })).toBeVisible()
  })

  test('should not show delete button for non-OWNER', async ({ page }) => {
    // Math 101 is cls-1 = STUDENT, but STUDENT doesn't have settings link
    // Navigate directly
    await page.goto('/classes/cls-1/settings')
    await expect(page.getByText('ABCD1234')).toBeVisible()
    await expect(page.getByRole('button', { name: /удалить класс/i })).not.toBeVisible()
  })

  test('should refresh invite code', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByRole('link', { name: /настройки/i }).click()
    await expect(page.getByText('ABCD1234')).toBeVisible()
    await page.getByRole('button', { name: /обновить код/i }).click()
    await expect(page.getByText('NEWC9999')).toBeVisible()
  })
})
