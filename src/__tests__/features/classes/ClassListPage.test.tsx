import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import ClassListPage from '@/pages/ClassListPage'

function renderClassListPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ClassListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ClassListPage', () => {
  beforeEach(() => {
    queryClient.clear()
    useAuthStore.getState().login('token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'ivan@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('should show loading skeletons initially', () => {
    renderClassListPage()
    expect(screen.getAllByTestId('class-card-skeleton')).toHaveLength(3)
  })

  it('should display class cards after loading', async () => {
    renderClassListPage()

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument()
    })

    expect(screen.getByText('Physics 201')).toBeInTheDocument()
  })

  it('should have a button to create or join class', async () => {
    const user = userEvent.setup()
    renderClassListPage()

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument()
    })

    const addButton = screen.getByTestId('add-class-button')
    expect(addButton).toBeInTheDocument()

    await user.click(addButton)

    expect(
      screen.getByText(/создать класс/i) || screen.getByText(/присоединиться/i),
    ).toBeTruthy()
  })
})
