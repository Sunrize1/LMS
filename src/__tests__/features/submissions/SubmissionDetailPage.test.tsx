import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import SubmissionDetailPage from '@/pages/SubmissionDetailPage'
import { useAuthStore } from '@/store/authStore'
import type { SubmissionDto } from '@/types/dto'

const mockSubmission: SubmissionDto = {
  id: 'sub-1',
  studentId: '3',
  studentName: 'Student One',
  answerText: 'My answer text',
  fileUrl: null,
  grade: null,
  submittedAt: '2026-03-01T00:00:00Z',
}

function renderWithProviders(state?: SubmissionDto) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[{ pathname: '/submissions/sub-1', state: state }]}
      >
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

  it('should display student name', () => {
    renderWithProviders(mockSubmission)
    expect(screen.getByText(/student one/i)).toBeInTheDocument()
  })

  it('should display answer text', () => {
    renderWithProviders(mockSubmission)
    expect(screen.getByText(/my answer text/i)).toBeInTheDocument()
  })

  it('should show grade input for ungraded submission', () => {
    renderWithProviders(mockSubmission)
    expect(screen.getByLabelText(/оценка/i)).toBeInTheDocument()
  })

  it('should display back navigation button', () => {
    renderWithProviders(mockSubmission)
    expect(screen.getByText(/назад к заданию/i)).toBeInTheDocument()
  })

  it('should display submitted date', () => {
    renderWithProviders(mockSubmission)
    expect(screen.getByText(/отправлено/i)).toBeInTheDocument()
  })

  it('should allow entering a grade value', async () => {
    const user = userEvent.setup()
    renderWithProviders(mockSubmission)

    await user.type(screen.getByLabelText(/оценка/i), '90')

    const submitButton = screen.getByRole('button', { name: /поставить оценку/i })
    expect(submitButton).toBeEnabled()
  })

  it('should show fallback when no state is passed', () => {
    renderWithProviders()
    expect(screen.getByText(/данные ответа не найдены/i)).toBeInTheDocument()
  })

  it('should display grade when submission is graded', () => {
    renderWithProviders({ ...mockSubmission, grade: 85 })
    expect(screen.getByText(/оценка: 85/i)).toBeInTheDocument()
  })
})
