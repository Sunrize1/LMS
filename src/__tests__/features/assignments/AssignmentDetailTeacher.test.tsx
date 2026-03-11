import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import AssignmentDetailPage from '@/pages/AssignmentDetailPage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(classId = 'cls-2', assignmentId = 'asgn-1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[`/classes/${classId}/assignments/${assignmentId}`]}
      >
        <Routes>
          <Route
            path="/classes/:classId/assignments/:assignmentId"
            element={<AssignmentDetailPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AssignmentDetailPage (teacher view)', () => {
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

  it('should display submissions list for OWNER', async () => {
    renderWithProviders('cls-2')

    await waitFor(() => {
      expect(screen.getByText(/student one/i)).toBeInTheDocument()
    })
  })

  it('should display assignment title', async () => {
    renderWithProviders('cls-2')

    await waitFor(() => {
      expect(screen.getByText('Homework 1')).toBeInTheDocument()
    })
  })

  it('should show submissions section heading', async () => {
    renderWithProviders('cls-2')

    await waitFor(() => {
      expect(screen.getByText(/работы студентов/i)).toBeInTheDocument()
    })
  })

  it('should show grade filter buttons', async () => {
    renderWithProviders('cls-2')

    await waitFor(() => {
      expect(screen.getByText(/работы студентов/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Все' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Оценённые' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Не оценённые' })).toBeInTheDocument()
  })

  it('should switch active filter on click', async () => {
    const user = userEvent.setup()
    renderWithProviders('cls-2')

    await waitFor(() => {
      expect(screen.getByText(/работы студентов/i)).toBeInTheDocument()
    })

    const gradedBtn = screen.getByRole('button', { name: 'Оценённые' })
    await user.click(gradedBtn)
    expect(gradedBtn.className).toContain('bg-indigo-600')
  })
})
