import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { JoinClassModal } from '@/features/classes/JoinClassModal'

function renderModal(isOpen = true, onClose = vi.fn()) {
  return render(
    <QueryClientProvider client={queryClient}>
      <JoinClassModal isOpen={isOpen} onClose={onClose} />
    </QueryClientProvider>,
  )
}

describe('JoinClassModal', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should not render when isOpen is false', () => {
    renderModal(false)
    expect(screen.queryByText(/присоединиться/i)).not.toBeInTheDocument()
  })

  it('should render modal with code input when open', () => {
    renderModal()
    expect(screen.getByText(/присоединиться к классу/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/код класса/i)).toBeInTheDocument()
  })

  it('should disable submit when code is empty', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /присоединиться$/i })).toBeDisabled()
  })

  it('should call onClose after successful join', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(true, onClose)

    await user.type(screen.getByLabelText(/код класса/i), 'ABCD1234')
    await user.click(screen.getByRole('button', { name: /присоединиться$/i }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })
})
