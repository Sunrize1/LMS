import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import ClassSettingsPage from '@/pages/ClassSettingsPage'

function renderPage(classId = 'cls-1') {
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

  it('should show delete class button', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('ABCD1234')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /удалить класс/i })).toBeInTheDocument()
  })
})
