import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach } from 'vitest'
import { CommentsSection } from '@/features/comments/CommentsSection'
import { useAuthStore } from '@/store/authStore'

function renderWithProviders(assignmentId = 'asgn-1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <CommentsSection assignmentId={assignmentId} />
    </QueryClientProvider>,
  )
}

describe('CommentsSection', () => {
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

  it('should display existing comments', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByText('Test comment')).toBeInTheDocument()
      expect(screen.getByText(/ivan ivanov/i)).toBeInTheDocument()
    })
  })

  it('should show comment input form', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/комментарий/i)).toBeInTheDocument()
    })
  })

  it('should disable send button when input is empty', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/комментарий/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled()
  })
})
