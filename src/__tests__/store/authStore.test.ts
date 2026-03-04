import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { UserDto } from '@/types/dto'

const mockUser: UserDto = {
  id: '1',
  firstName: 'Ivan',
  lastName: 'Ivanov',
  email: 'ivan@test.com',
  avatarUrl: null,
  dateOfBirth: '2000-01-01',
  createdAt: '2026-01-01T00:00:00Z',
}

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    localStorage.clear()
  })

  it('should have initial unauthenticated state', () => {
    const state = useAuthStore.getState()

    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set token and user on login', () => {
    useAuthStore.getState().login('jwt-token-123', mockUser)

    const state = useAuthStore.getState()
    expect(state.token).toBe('jwt-token-123')
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should persist token to localStorage on login', () => {
    useAuthStore.getState().login('jwt-token-123', mockUser)

    const stored = localStorage.getItem('lms_token')
    expect(stored).not.toBeNull()

    const parsed = JSON.parse(stored!)
    expect(parsed.state.token).toBe('jwt-token-123')
    expect(parsed.state.isAuthenticated).toBe(true)
  })

  it('should clear state on logout', () => {
    useAuthStore.getState().login('jwt-token-123', mockUser)
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should clear localStorage on logout', () => {
    useAuthStore.getState().login('jwt-token-123', mockUser)
    useAuthStore.getState().logout()

    const stored = localStorage.getItem('lms_token')
    const parsed = JSON.parse(stored!)
    expect(parsed.state.token).toBeNull()
    expect(parsed.state.isAuthenticated).toBe(false)
  })

  it('should update user data with setUser', () => {
    useAuthStore.getState().login('jwt-token-123', mockUser)

    const updatedUser: UserDto = {
      ...mockUser,
      firstName: 'Updated',
      lastName: 'Name',
    }

    useAuthStore.getState().setUser(updatedUser)

    const state = useAuthStore.getState()
    expect(state.user?.firstName).toBe('Updated')
    expect(state.user?.lastName).toBe('Name')
    expect(state.token).toBe('jwt-token-123')
    expect(state.isAuthenticated).toBe(true)
  })
})
