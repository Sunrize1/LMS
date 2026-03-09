import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AssignmentCard } from '@/features/assignments/AssignmentCard'
import type { AssignmentDto } from '@/types/dto'

const mockAssignment: AssignmentDto = {
  id: 'asgn-1',
  title: 'Homework 1',
  description: 'First homework',
  deadline: null,
  createdAt: '2026-02-10T00:00:00Z',
  submissionStatus: 'NOT_SUBMITTED',
  grade: null,
}

function renderCard(assignment = mockAssignment, classId = 'cls-1') {
  return render(
    <MemoryRouter>
      <AssignmentCard assignment={assignment} classId={classId} />
    </MemoryRouter>,
  )
}

describe('AssignmentCard', () => {
  it('should display assignment title', () => {
    renderCard()
    expect(screen.getByText('Homework 1')).toBeInTheDocument()
  })

  it('should display submission status badge', () => {
    renderCard()
    expect(screen.getByText('NOT_SUBMITTED')).toBeInTheDocument()
  })

  it('should link to assignment detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/classes/cls-1/assignments/asgn-1')
  })

  it('should display GRADED status', () => {
    renderCard({ ...mockAssignment, submissionStatus: 'GRADED' })
    expect(screen.getByText('GRADED')).toBeInTheDocument()
  })
})
