import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Comments', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
    await page.getByText('Math 101').click()
    await page.getByText('Homework 1').click()
  })

  test('should display existing comments', async ({ page }) => {
    await expect(page.getByText('Test comment')).toBeVisible()
    // Comment author name in the comments section
    const commentsSection = page.locator('text=Комментарии').locator('..')
    await expect(commentsSection.getByText(/ivan ivanov/i).first()).toBeVisible()
  })

  test('should show comment author initials when no avatar', async ({ page }) => {
    // II = Ivan Ivanov initials (may appear in comments and elsewhere)
    await expect(page.getByText('II').first()).toBeVisible()
  })

  test('should show comment date', async ({ page }) => {
    // The date from mock is 2026-03-01, format depends on locale
    const commentDate = page.locator('span').filter({ hasText: /\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4}/ })
    await expect(commentDate.first()).toBeVisible()
  })

  test('should have comment input field', async ({ page }) => {
    await expect(page.getByPlaceholder(/комментарий/i)).toBeVisible()
  })

  test('should disable send button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /отправить/i })).toBeDisabled()
  })

  test('should enable send button when input has text', async ({ page }) => {
    await page.getByPlaceholder(/комментарий/i).fill('New test comment')
    await expect(page.getByRole('button', { name: /отправить/i })).toBeEnabled()
  })

  test('should clear input after submitting comment', async ({ page }) => {
    const input = page.getByPlaceholder(/комментарий/i)
    await input.fill('New test comment')
    await page.getByRole('button', { name: /отправить/i }).click()
    await expect(input).toHaveValue('')
  })
})
