import { test, expect } from '@playwright/test'
import { loginViaUI } from './helpers'

test.describe('Classes', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaUI(page)
  })

  test('should display class list after login', async ({ page }) => {
    await expect(page.getByText('Math 101')).toBeVisible()
    await expect(page.getByText('Physics 201')).toBeVisible()
  })

  test('should show class cards with member count and role badges', async ({ page }) => {
    await expect(page.getByText('Студент')).toBeVisible()
    await expect(page.getByText('Владелец')).toBeVisible()
  })

  test('should open create class modal', async ({ page }) => {
    await page.getByTestId('add-class-button').click()
    await page.getByText(/создать класс/i).click()
    await expect(page.getByLabel(/название/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /создать$/i })).toBeVisible()
  })

  test('should create a new class', async ({ page }) => {
    await page.getByTestId('add-class-button').click()
    await page.getByText(/создать класс/i).click()
    await page.getByLabel(/название/i).fill('New Test Class')
    await page.getByRole('button', { name: /создать$/i }).click()
    // Modal should close after creation
    await expect(page.getByLabel(/название/i)).not.toBeVisible()
  })

  test('should open join class modal', async ({ page }) => {
    await page.getByTestId('add-class-button').click()
    await page.getByText(/присоединиться по коду/i).click()
    await expect(page.getByLabel(/код класса/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /присоединиться/i })).toBeVisible()
  })

  test('should join class by code', async ({ page }) => {
    await page.getByTestId('add-class-button').click()
    await page.getByText(/присоединиться по коду/i).click()
    await page.getByLabel(/код класса/i).fill('ABCD1234')
    await page.getByRole('button', { name: /присоединиться/i }).click()
    // Modal should close after joining
    await expect(page.getByLabel(/код класса/i)).not.toBeVisible()
  })

  test('should navigate to class detail page', async ({ page }) => {
    await page.getByText('Math 101').click()
    await expect(page.getByRole('heading', { name: 'Math 101' })).toBeVisible()
  })

  test('should show class toolbar with code for owner', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await expect(page.getByText(/код:/i)).toBeVisible()
    await expect(page.getByText('ABCD1234')).toBeVisible()
  })

  test('should show assignments on class detail page', async ({ page }) => {
    await page.getByText('Math 101').click()
    await expect(page.getByText('Homework 1')).toBeVisible()
  })

  test('should show settings link for owner/teacher', async ({ page }) => {
    await page.getByText('Physics 201').click()
    await expect(page.getByRole('link', { name: /настройки/i })).toBeVisible()
  })

  test('should show members link', async ({ page }) => {
    await page.getByText('Math 101').click()
    await expect(page.getByRole('link', { name: /участники/i })).toBeVisible()
  })

  test('should close create modal on ESC', async ({ page }) => {
    await page.getByTestId('add-class-button').click()
    await page.getByText(/создать класс/i).click()
    await expect(page.getByLabel(/название/i)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByLabel(/название/i)).not.toBeVisible()
  })
})
