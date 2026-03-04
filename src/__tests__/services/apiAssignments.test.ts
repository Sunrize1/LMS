import { describe, it, expect } from 'vitest'
import { apiAssignments } from '@/services/apiAssignments'
import type { AssignmentDto } from '@/types/dto'

describe('apiAssignments', () => {
  it('should return assignments for a class', async () => {
    const result: AssignmentDto[] = await apiAssignments.getByClassId('cls-1')

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Homework 1')
    expect(result[0].submissionStatus).toBe('NOT_SUBMITTED')
  })

  it('should create a new assignment', async () => {
    const result = await apiAssignments.create('cls-1', {
      title: 'New Assignment',
    })

    expect(result.id).toBe('asgn-2')
    expect(result.title).toBe('New Assignment')
  })
})
