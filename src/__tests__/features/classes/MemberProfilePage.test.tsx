import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import MemberProfilePage from '@/pages/MemberProfilePage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(classId = 'cls-1', memberId = 'mem-2') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/classes/${classId}/members/${memberId}`]}>
        <Routes>
          <Route
            path="/classes/:classId/members/:memberId"
            element={<MemberProfilePage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MemberProfilePage', () => {
  beforeEach(() => {
    useAuthStore.getState().login('test-jwt-token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('should display member name and email', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Petr Petrov')).toBeInTheDocument()
      expect(screen.getByText('petr@test.com')).toBeInTheDocument()
    })
  })

  it('should display member role badge', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Студент')).toBeInTheDocument()
    })
  })

  it('should display member initials avatar', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('PP')).toBeInTheDocument()
    })
  })
})
