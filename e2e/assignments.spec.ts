import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Assignments', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
  })

  test('should display assignments on class detail page', async ({ page }) => {
    await page.getByText('Math 101').click()
    await expect(page.getByText('Homework 1')).toBeVisible()
    await expect(page.getByText('First homework')).toBeVisible()
  })

  test('should navigate to assignment detail page', async ({ page }) => {
    await page.getByText('Math 101').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByRole('heading', { name: 'Homework 1' })).toBeVisible()
    await expect(page.getByText('First homework description')).toBeVisible()
  })

  test('should show deadline on assignment detail', async ({ page }) => {
    await page.getByText('Math 101').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByText(/дедлайн/i)).toBeVisible()
  })

  test('should show student submission when exists (student view)', async ({ page }) => {
    // Math 101 = cls-1 = STUDENT role
    await page.getByText('Math 101').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByRole('heading', { name: /ваш ответ/i })).toBeVisible()
  })

  test('should show grade when submission is graded', async ({ page }) => {
    await page.getByText('Math 101').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByText('85')).toBeVisible()
  })

  test('should show submissions list for teacher/owner', async ({ page }) => {
    // Physics 201 = cls-2 = OWNER role
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByText(/работы студентов/i)).toBeVisible()
    await expect(page.getByText('Student One')).toBeVisible()
  })

  test('should show grade filter buttons for teacher', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByRole('button', { name: 'Все' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Оценённые', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Не оценённые', exact: true })).toBeVisible()
  })

  test('should show comments section on assignment detail', async ({ page }) => {
    await page.getByText('Math 101').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByText(/комментарии/i)).toBeVisible()
    await expect(page.getByText('Test comment')).toBeVisible()
  })

  test('should show create assignment button for owner', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await expect(page.getByRole('button', { name: /создать задание/i })).toBeVisible()
  })
})
