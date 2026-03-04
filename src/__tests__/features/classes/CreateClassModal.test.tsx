import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { CreateClassModal } from '@/features/classes/CreateClassModal'

function renderModal(isOpen = true, onClose = vi.fn()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateClassModal isOpen={isOpen} onClose={onClose} />
    </QueryClientProvider>,
  )
}

describe('CreateClassModal', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should not render when isOpen is false', () => {
    renderModal(false)
    expect(screen.queryByText(/создать класс/i)).not.toBeInTheDocument()
  })

  it('should render modal with name input when open', () => {
    renderModal()
    expect(screen.getByText(/создать класс/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/название/i)).toBeInTheDocument()
  })

  it('should disable submit when name is empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /создать$/i })).toBeDisabled()
  })

  it('should call onClose after successful creation', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(true, onClose)

    await user.type(screen.getByLabelText(/название/i), 'New Class')
    await user.click(screen.getByRole('button', { name: /создать$/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('should close on Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(true, onClose)

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
