import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { CreateAssignmentModal } from '@/features/assignments/CreateAssignmentModal'

function renderModal(isOpen = true, onClose = vi.fn(), classId = 'cls-1') {
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateAssignmentModal isOpen={isOpen} onClose={onClose} classId={classId} />
    </QueryClientProvider>,
  )
}

describe('CreateAssignmentModal', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should not render when isOpen is false', () => {
    renderModal(false)
    expect(screen.queryByText(/создать задание/i)).not.toBeInTheDocument()
  })

  it('should render modal with title input when open', () => {
    renderModal()
    expect(screen.getByText(/создать задание/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/название/i)).toBeInTheDocument()
  })

  it('should have optional description field', () => {
    renderModal()
    expect(screen.getByLabelText(/описание/i)).toBeInTheDocument()
  })

  it('should disable submit when title is empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /создать$/i })).toBeDisabled()
  })

  it('should call onClose after successful creation', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(true, onClose)

    await user.type(screen.getByLabelText(/название/i), 'New Assignment')
    await user.click(screen.getByRole('button', { name: /создать$/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
