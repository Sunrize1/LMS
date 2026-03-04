import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'

describe('AuthLayout', () => {
  it('should render child route content', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })

  it('should render a centered container', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    const layout = container.firstElementChild as HTMLElement
    expect(layout).toBeTruthy()
    expect(layout.className).toContain('flex')
    expect(layout.className).toContain('min-h-screen')
  })
})
