import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import { RegisterForm } from '@/features/auth/RegisterForm'

function renderRegisterForm(onSuccess = vi.fn()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RegisterForm onSuccess={onSuccess} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    queryClient.clear()
  })

  it('should render all required fields', () => {
    renderRegisterForm()

    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/фамилия/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^пароль$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/подтвердите пароль/i)).toBeInTheDocument()
  })

  it('should disable submit button when fields are empty', () => {
    renderRegisterForm()

    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeDisabled()
  })

  it('should show validation error for short password', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText(/^пароль$/i), 'short')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/минимум 8 символов/i)).toBeInTheDocument()
    })
  })

  it('should show validation error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText(/^пароль$/i), 'password123')
    await user.type(screen.getByLabelText(/подтвердите пароль/i), 'different123')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/пароли не совпадают/i)).toBeInTheDocument()
    })
  })

  it('should call onSuccess after successful registration', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    renderRegisterForm(onSuccess)

    await user.type(screen.getByLabelText(/имя/i), 'New')
    await user.type(screen.getByLabelText(/фамилия/i), 'User')
    await user.type(screen.getByLabelText(/email/i), 'new@test.com')
    await user.type(screen.getByLabelText(/^пароль$/i), 'password123')
    await user.type(screen.getByLabelText(/подтвердите пароль/i), 'password123')
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('should store token in authStore after successful registration', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText(/имя/i), 'New')
    await user.type(screen.getByLabelText(/фамилия/i), 'User')
    await user.type(screen.getByLabelText(/email/i), 'new@test.com')
    await user.type(screen.getByLabelText(/^пароль$/i), 'password123')
    await user.type(screen.getByLabelText(/подтвердите пароль/i), 'password123')
    await user.click(screen.getByRole('button', { name: /зарегистрироваться/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().token).toBe('test-jwt-token')
    })
  })

  it('should render link to login page', () => {
    renderRegisterForm()

    const link = screen.getByRole('link', { name: /войти/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })
})
