import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyState } from '@/components/EmptyState'

describe('EmptyState', () => {
  it('should display message', () => {
    render(<EmptyState message="Нет данных" />)
    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })
})
