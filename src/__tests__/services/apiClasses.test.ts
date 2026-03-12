import { describe, it, expect } from 'vitest'
import { apiClasses } from '@/services/apiClasses'
import type { ClassDto } from '@/types/dto'

describe('apiClasses', () => {
  it('should return paginated list of classes', async () => {
    const result = await apiClasses.getMyClasses()

    expect(result.content).toHaveLength(2)
    expect(result.content[0].name).toBe('Math 101')
    expect(result.content[0].myRole).toBe('STUDENT')
    expect(result.content[1].myRole).toBe('OWNER')
  })

  it('should create a new class', async () => {
    const result: ClassDto = await apiClasses.createClass({ name: 'New Class' })

    expect(result.id).toBe('cls-3')
    expect(result.name).toBe('New Class')
    expect(result.myRole).toBe('OWNER')
  })

  it('should join a class by code', async () => {
    const result: ClassDto = await apiClasses.joinClass({ code: 'ABCD1234' })

    expect(result.id).toBe('cls-1')
    expect(result.name).toBe('Math 101')
  })

  it('should regenerate class code', async () => {
    const result: ClassDto = await apiClasses.regenerateCode('cls-2')

    expect(result.code).toBe('NEWC9999')
  })
})
