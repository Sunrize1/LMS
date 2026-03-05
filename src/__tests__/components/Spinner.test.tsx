import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from '@/components/Spinner'

describe('Spinner', () => {
  it('should render a spinner with role status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have accessible loading text', () => {
    render(<Spinner />)
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument()
  })
})
