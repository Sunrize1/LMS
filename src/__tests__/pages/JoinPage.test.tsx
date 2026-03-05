import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import JoinPage from '@/pages/JoinPage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(query = '?code=ABCD1234') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/join${query}`]}>
        <Routes>
          <Route path="/join" element={<JoinPage />} />
          <Route path="/classes" element={<div>Classes List</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('JoinPage', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('should redirect to login if not authenticated', () => {
    renderWithProviders()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('should show join modal with code when authenticated', () => {
    useAuthStore.getState().login('test-jwt-token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })

    renderWithProviders()
    expect(screen.getByText(/присоединиться к классу/i)).toBeInTheDocument()
  })

  it('should pre-fill code from URL', () => {
    useAuthStore.getState().login('test-jwt-token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })

    renderWithProviders('?code=TESTCODE')
    expect(screen.getByDisplayValue('TESTCODE')).toBeInTheDocument()
  })
})
