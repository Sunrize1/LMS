import { describe, it, expect } from 'vitest'
import { apiSubmissions } from '@/services/apiSubmissions'

describe('apiSubmissions', () => {
  it('should return paginated submissions for an assignment (teacher view)', async () => {
    const result = await apiSubmissions.getByAssignmentId('asgn-1')

    expect(result.content).toHaveLength(1)
    expect(result.content[0].studentName).toBe('Student One')
    expect(result.content[0].grade).toBeNull()
    expect(result.totalElements).toBe(1)
    expect(result.number).toBe(0)
  })

  it('should return my submission for an assignment (student view)', async () => {
    const result: SubmissionDto = await apiSubmissions.getMy('asgn-1')

    expect(result.studentName).toBe('Ivan Ivanov')
    expect(result.grade).toBe(85)
  })

  it('should cancel my submission', async () => {
    await expect(apiSubmissions.cancelMy('asgn-1')).resolves.toBeUndefined()
  })
})
