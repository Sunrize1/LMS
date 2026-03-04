import { describe, it, expect } from 'vitest'
import { apiUsers } from '@/services/apiUsers'
import type { UserDto } from '@/types/dto'

describe('apiUsers', () => {
  it('should return current user profile', async () => {
    const result: UserDto = await apiUsers.getMe()

    expect(result.id).toBe('1')
    expect(result.firstName).toBe('Ivan')
    expect(result.email).toBe('user@test.com')
  })

  it('should update current user profile', async () => {
    const result: UserDto = await apiUsers.updateMe({
      firstName: 'Updated',
      lastName: 'User',
    })

    expect(result.firstName).toBe('Updated')
    expect(result.lastName).toBe('User')
  })
})
