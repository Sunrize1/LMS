import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import { LoginForm } from '@/features/auth/LoginForm'

function renderLoginForm(onSuccess = vi.fn()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginForm onSuccess={onSuccess} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    queryClient.clear()
  })

  it('should render email and password fields', () => {
    renderLoginForm()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
  })

  it('should render submit button', () => {
    renderLoginForm()

    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('should disable submit button when fields are empty', () => {
    renderLoginForm()

    expect(screen.getByRole('button', { name: /войти/i })).toBeDisabled()
  })

  it('should show email validation error for invalid format', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/некорректный email/i)).toBeInTheDocument()
    })
  })

  it('should enable submit button when fields are valid', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/пароль/i), 'password123')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /войти/i })).toBeEnabled()
    })
  })

  it('should call onSuccess after successful login', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderLoginForm(onSuccess)

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/пароль/i), 'password123')
    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('should store token in authStore after successful login', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'user@test.com')
    await user.type(screen.getByLabelText(/пароль/i), 'password123')
    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().token).toBe('test-jwt-token')
    })
  })

  it('should show error message on invalid credentials', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'wrong@test.com')
    await user.type(screen.getByLabelText(/пароль/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should render link to register page', () => {
    renderLoginForm()

    const link = screen.getByRole('link', { name: /зарегистрироваться/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/register')
  })
})
