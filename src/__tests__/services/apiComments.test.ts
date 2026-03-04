import { describe, it, expect } from 'vitest'
import { apiComments } from '@/services/apiComments'
import type { CommentDto } from '@/types/dto'

describe('apiComments', () => {
  it('should return comments for an assignment', async () => {
    const result: CommentDto[] = await apiComments.getByAssignmentId('asgn-1')

    expect(result).toHaveLength(1)
    expect(result[0].authorName).toBe('Ivan Ivanov')
    expect(result[0].text).toBe('Test comment')
  })

  it('should add a new comment', async () => {
    const result: CommentDto = await apiComments.add('asgn-1', { text: 'New comment' })

    expect(result.id).toBe('cmt-2')
    expect(result.text).toBe('New comment')
  })
})
