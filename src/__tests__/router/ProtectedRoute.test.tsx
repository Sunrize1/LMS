import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ProtectedRoute } from '@/router/ProtectedRoute'

const mockUser = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  avatarUrl: null,
  dateOfBirth: null,
  createdAt: '2026-01-01T00:00:00Z',
}

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/classes" element={<div>Classes Page</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('should redirect to /login when not authenticated', () => {
    renderWithRouter('/classes')

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Classes Page')).not.toBeInTheDocument()
  })

  it('should render children when authenticated', () => {
    useAuthStore.getState().login('token', mockUser)
    renderWithRouter('/classes')

    expect(screen.getByText('Classes Page')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })
})
