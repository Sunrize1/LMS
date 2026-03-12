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

  it('should upload avatar', async () => {
    const file = new File(['test'], 'avatar.png', { type: 'image/png' })
    const result: UserDto = await apiUsers.uploadAvatar(file)

    expect(result.avatarUrl).toBe('http://localhost:8080/api/v1/files/avatar.jpeg')
  })
})
