import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import AssignmentDetailPage from '@/pages/AssignmentDetailPage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(classId = 'cls-1', assignmentId = 'asgn-1') {
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

describe('AssignmentDetailPage', () => {
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

  it('should display assignment title and description', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Homework 1')).toBeInTheDocument()
      expect(screen.getByText('First homework description')).toBeInTheDocument()
    })
  })

  it('should show existing submission text', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/my submission/i)).toBeInTheDocument()
    })
  })

  it('should show submission grade when graded', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/85/)).toBeInTheDocument()
    })
  })

  it('should display deadline when set', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/дедлайн/i)).toBeInTheDocument()
    })
  })

  it('should show file input in submission form when no submission exists', async () => {
    server.use(
      http.get('http://localhost:8080/api/v1/assignments/:assignmentId/submissions/my', () => {
        return new HttpResponse(null, { status: 404 })
      }),
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByLabelText(/прикрепить файл/i)).toBeInTheDocument()
    })
  })

  it('should show answer textarea when no submission exists', async () => {
    server.use(
      http.get('http://localhost:8080/api/v1/assignments/:assignmentId/submissions/my', () => {
        return new HttpResponse(null, { status: 404 })
      }),
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByLabelText(/ответ/i)).toBeInTheDocument()
    })
  })

  it('should show cancel button for ungraded submission', async () => {
    server.use(
      http.get('http://localhost:8080/api/v1/assignments/:assignmentId/submissions/my', () => {
        return HttpResponse.json({
          id: 'sub-2',
          studentId: '1',
          studentName: 'Ivan Ivanov',
          answerText: 'My submission',
          studentAvatarUrl: null,
          fileUrls: null,
          grade: null,
          submittedAt: '2026-03-01T00:00:00Z',
        })
      }),
    )

    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /отменить отправку/i })).toBeInTheDocument()
    })
  })

  it('should not show cancel button for graded submission', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/my submission/i)).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: /отменить отправку/i })).not.toBeInTheDocument()
  })
})
