import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import MembersPage from '@/pages/MembersPage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(classId = 'cls-2') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/classes/${classId}/members`]}>
        <Routes>
          <Route path="/classes/:classId/members" element={<MembersPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MembersPage', () => {
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

  it('should display class members after loading', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Ivan Ivanov')).toBeInTheDocument()
      expect(screen.getByText('Petr Petrov')).toBeInTheDocument()
    })
  })

  it('should display role badges for members', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('OWNER')).toBeInTheDocument()
      expect(screen.getByText('STUDENT')).toBeInTheDocument()
    })
  })

  it('should display member emails', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('ivan@test.com')).toBeInTheDocument()
      expect(screen.getByText('petr@test.com')).toBeInTheDocument()
    })
  })

  it('should show loading skeletons while fetching', () => {
    renderWithProviders()
    expect(screen.getAllByTestId('member-skeleton').length).toBeGreaterThan(0)
  })

  it('should show remove button for non-self members when user is OWNER', async () => {
    renderWithProviders()

    await waitFor(() => {
      const removeButtons = screen.getAllByRole('button', { name: /удалить/i })
      expect(removeButtons.length).toBe(1) // only for Petr, not for self
    })
  })
})
