import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ClassCard } from '@/features/classes/ClassCard'
import type { ClassDto } from '@/types/dto'

const mockClass: ClassDto = {
  id: 'cls-1',
  name: 'Math 101',
  code: 'ABCD1234',
  myRole: 'STUDENT',
  memberCount: 20,
  createdAt: '2026-01-15T00:00:00Z',
}

function renderClassCard(classData = mockClass) {
  return render(
    <MemoryRouter>
      <ClassCard classItem={classData} />
    </MemoryRouter>,
  )
}

describe('ClassCard', () => {
  it('should display class name', () => {
    renderClassCard()
    expect(screen.getByText('Math 101')).toBeInTheDocument()
  })

  it('should display role badge', () => {
    renderClassCard()
    expect(screen.getByText('Студент')).toBeInTheDocument()
  })

  it('should display member count', () => {
    renderClassCard()
    expect(screen.getByText(/20/)).toBeInTheDocument()
  })

  it('should link to class detail page', () => {
    renderClassCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/classes/cls-1')
  })

  it('should display OWNER role badge for owner', () => {
    renderClassCard({ ...mockClass, myRole: 'OWNER' })
    expect(screen.getByText('Владелец')).toBeInTheDocument()
  })
})
