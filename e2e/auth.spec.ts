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
    const link = page.getByRole('link', { name: /зарегистрироваться/i })
    await expect(link).toBeVisible()
  })

  test('should show register page', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /регистрация/i })).toBeVisible()
    await expect(page.getByLabel(/^имя$/i)).toBeVisible()
    await expect(page.getByLabel(/^фамилия$/i)).toBeVisible()
  })

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/classes')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('user@test.com')
    await page.getByLabel(/пароль/i).fill('password123')
    await page.getByTestId('login-button').click()
    await expect(page).toHaveURL(/\/classes/)
    await expect(page.getByText(/мои классы/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('wrong@test.com')
    await page.getByLabel(/пароль/i).fill('wrongpass')
    await page.getByTestId('login-button').click()
    await expect(page.getByText(/invalid|неверн|ошибка/i)).toBeVisible()
  })

  test('should show validation errors on login form', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/email/i).blur()
    await expect(page.getByText(/некорректный email/i)).toBeVisible()
  })

  test('should register a new user', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel(/^имя$/i).fill('Test')
    await page.getByLabel(/^фамилия$/i).fill('User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^пароль$/i).fill('password123')
    await page.getByLabel(/подтвердите пароль/i).fill('password123')
    await page.getByRole('button', { name: /зарегистрироваться/i }).click()
    await expect(page).toHaveURL(/\/classes/)
  })

  test('should show validation error when passwords do not match', async ({ page }) => {
    await page.goto('/register')
    await page.getByLabel(/^пароль$/i).fill('password123')
    await page.getByLabel(/подтвердите пароль/i).fill('different123')
    await page.getByLabel(/подтвердите пароль/i).blur()
    await expect(page.getByText(/пароли не совпадают/i)).toBeVisible()
  })

  test('should have avatar upload on register page', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByTestId('avatar-input')).toBeAttached()
    await expect(page.getByText(/загрузить аватар/i)).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('user@test.com')
    await page.getByLabel(/пароль/i).fill('password123')
    await page.getByTestId('login-button').click()
    await expect(page).toHaveURL(/\/classes/)
    await page.getByRole('button', { name: /выйти/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect authenticated user from login to classes', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('user@test.com')
    await page.getByLabel(/пароль/i).fill('password123')
    await page.getByTestId('login-button').click()
    await expect(page).toHaveURL(/\/classes/)
    // Try to go to login again
    await page.goto('/login')
    await expect(page).toHaveURL(/\/classes/)
  })
})
