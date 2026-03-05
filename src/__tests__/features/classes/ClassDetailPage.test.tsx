import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import ClassDetailPage from '@/pages/ClassDetailPage'

function renderPage(classId = 'cls-2') {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/classes/${classId}`]}>
        <Routes>
          <Route path="/classes/:classId" element={<ClassDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ClassDetailPage', () => {
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

  it('should display class name after loading', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument()
    })
  })

  it('should display assignments after loading', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Homework 1')).toBeInTheDocument()
    })
  })

  it('should show toolbar with settings and members links for OWNER', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Math 101')).toBeInTheDocument()
    })

    expect(screen.getByText(/участники/i)).toBeInTheDocument()
    expect(screen.getByText(/настройки/i)).toBeInTheDocument()
  })
})
