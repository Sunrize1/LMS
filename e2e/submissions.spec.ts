import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Submissions', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
  })

  test('should show submission detail when clicking on student submission (teacher view)', async ({ page }) => {
    // Navigate to assignment as OWNER (cls-2)
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await expect(page.getByText('Student One')).toBeVisible()
    // Click on the submission
    await page.getByText('Student One').click()
    await expect(page.getByRole('heading', { name: /student one/i })).toBeVisible()
    await expect(page.getByText('My answer')).toBeVisible()
  })

  test('should show grade input on ungraded submission', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await page.getByText('Student One').click()
    await expect(page.getByLabel(/оценка/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /поставить оценку/i })).toBeVisible()
  })

  test('should show back button on submission detail', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await page.getByText('Student One').click()
    await expect(page.getByText(/назад к заданию/i)).toBeVisible()
  })

  test('should show submission date', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await page.getByText('Student One').click()
    await expect(page.getByText(/отправлено/i)).toBeVisible()
  })

  test('should allow entering grade value', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await page.getByText('Homework 1').click()
    await page.getByText('Student One').click()
    await page.getByLabel(/оценка/i).fill('95')
    await expect(page.getByRole('button', { name: /поставить оценку/i })).toBeEnabled()
  })
})
