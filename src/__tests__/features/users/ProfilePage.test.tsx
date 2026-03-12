import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import ProfilePage from '@/pages/ProfilePage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    useAuthStore.getState().login('test-jwt-token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: '2000-01-01',
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('should display user name from API', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ivan')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Ivanov')).toBeInTheDocument()
    })
  })

  it('should display user email', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('user@test.com')).toBeInTheDocument()
    })
  })

  it('should have a save button', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument()
    })
  })

  it('should have a hidden file input for avatar upload', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByTestId('avatar-upload')).toBeInTheDocument()
    })
  })
})
