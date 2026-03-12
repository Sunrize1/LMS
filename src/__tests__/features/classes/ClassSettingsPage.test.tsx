import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import ClassSettingsPage from '@/pages/ClassSettingsPage'

function renderPage(classId = 'cls-2') {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/classes/${classId}/settings`]}>
        <Routes>
          <Route path="/classes/:classId/settings" element={<ClassSettingsPage />} />
          <Route path="/classes" element={<div>Classes List</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ClassSettingsPage', () => {
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

  it('should display invite code after loading', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('ABCD1234')).toBeInTheDocument()
    })
  })

  it('should have a copy code button', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('ABCD1234')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /скопировать/i })).toBeInTheDocument()
  })

  it('should have a regenerate code button', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('ABCD1234')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /обновить код/i })).toBeInTheDocument()
  })

  it('should show delete class button only for OWNER', async () => {
    renderPage('cls-2') // cls-2 is OWNER in mock

    await waitFor(() => {
      expect(screen.getByText('ABCD1234')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /удалить класс/i })).toBeInTheDocument()
  })

  it('should hide delete class button for non-OWNER', async () => {
    renderPage('cls-1') // cls-1 is STUDENT in mock

    await waitFor(() => {
      expect(screen.getByText('ABCD1234')).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: /удалить класс/i })).not.toBeInTheDocument()
  })

  it('should show class name input pre-filled with current name', async () => {
    renderPage()

    await waitFor(() => {
      const input = screen.getByLabelText(/название/i)
      expect(input).toHaveValue('Math 101')
    })
  })

  it('should have a save button for class name', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByLabelText(/название/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument()
  })

  it('should allow updating class name', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => {
      expect(screen.getByLabelText(/название/i)).toHaveValue('Math 101')
    })

    const input = screen.getByLabelText(/название/i)
    await user.clear(input)
    await user.type(input, 'Updated Math')

    expect(input).toHaveValue('Updated Math')
    expect(screen.getByRole('button', { name: /сохранить/i })).toBeEnabled()
  })
})
