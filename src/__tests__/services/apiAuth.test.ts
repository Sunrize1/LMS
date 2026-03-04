import { describe, it, expect } from 'vitest'
import { apiAuth } from '@/services/apiAuth'
import type { AuthResponse } from '@/types/dto'

describe('apiAuth', () => {
  it('should login with valid credentials and return AuthResponse', async () => {
    const result: AuthResponse = await apiAuth.login({
      email: 'user@test.com',
      password: 'password123',
    })

    expect(result.token).toBe('test-jwt-token')
    expect(result.user.id).toBe('1')
    expect(result.user.firstName).toBe('Ivan')
    expect(result.user.email).toBe('user@test.com')
  })

  it('should throw on invalid credentials', async () => {
    await expect(
      apiAuth.login({ email: 'wrong@test.com', password: 'wrong' }),
    ).rejects.toThrow()
  })

  it('should register a new user and return AuthResponse', async () => {
    const result: AuthResponse = await apiAuth.register({
      firstName: 'New',
      lastName: 'User',
      email: 'new@test.com',
      password: 'password123',
    })

    expect(result.token).toBe('test-jwt-token')
    expect(result.user.id).toBe('2')
    expect(result.user.firstName).toBe('New')
  })
})
