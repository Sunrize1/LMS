import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import SubmissionDetailPage from '@/pages/SubmissionDetailPage'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(submissionId = 'sub-1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/submissions/${submissionId}`]}>
        <Routes>
          <Route path="/submissions/:submissionId" element={<SubmissionDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SubmissionDetailPage', () => {
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

  it('should display student name', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/student one/i)).toBeInTheDocument()
    })
  })

  it('should display answer text', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText(/my answer text/i)).toBeInTheDocument()
    })
  })

  it('should show grade input for teacher', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByLabelText(/оценка/i)).toBeInTheDocument()
    })
  })
})
