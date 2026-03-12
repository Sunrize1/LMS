import { type Page } from '@playwright/test'

/**
 * Logs in a user by setting auth state directly in localStorage
 * (simulating a completed login via the Zustand persisted store).
 */
export async function loginAsUser(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'lms_token',
      JSON.stringify('test-jwt-token'),
    )
  })
}

/**
 * Performs login through the UI form using MSW-mocked credentials.
 */
export async function loginViaUI(page: Page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('user@test.com')
  await page.getByLabel(/пароль/i).fill('password123')
  await page.getByTestId('login-button').click()
  await page.waitForURL(/\/classes/)
}
