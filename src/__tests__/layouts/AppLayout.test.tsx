import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { useAuthStore } from '@/store/authStore'

describe('AppLayout', () => {
  it('should render child route content', () => {
    useAuthStore.getState().login('token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'ivan@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })

    render(
      <MemoryRouter initialEntries={['/classes']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/classes" element={<div>Classes List</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Classes List')).toBeInTheDocument()
  })

  it('should render navigation bar', () => {
    useAuthStore.getState().login('token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'ivan@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })

    render(
      <MemoryRouter initialEntries={['/classes']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/classes" element={<div>Classes List</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
