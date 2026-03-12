import { describe, it, expect, vi } from 'vitest'
import { apiUsers } from '@/services/apiUsers'
import { apiClient } from '@/services/apiClient'
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
    const mockResponse: UserDto = {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: 'http://localhost:8080/api/v1/files/avatar.jpeg',
      dateOfBirth: '2000-01-01',
      createdAt: '2026-01-01T00:00:00Z',
    }

    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ data: mockResponse })

    const file = new File(['test'], 'avatar.png', { type: 'image/png' })
    const result: UserDto = await apiUsers.uploadAvatar(file)

    expect(result.avatarUrl).toBe('http://localhost:8080/api/v1/files/avatar.jpeg')
    expect(postSpy).toHaveBeenCalledWith('/v1/users/me/avatar', expect.any(FormData))

    postSpy.mockRestore()
  })
})
