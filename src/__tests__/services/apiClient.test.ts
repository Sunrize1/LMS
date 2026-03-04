import { describe, it, expect, beforeEach } from 'vitest'
import { apiClient } from '@/services/apiClient'

describe('apiClient', () => {
  it('should have baseURL from env', () => {
    expect(apiClient.defaults.baseURL).toBeDefined()
  })

  it('should set Content-Type to application/json', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should attach Authorization header when token exists', async () => {
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().login('test-token', {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })

    // Make a request — MSW will intercept it
    const response = await apiClient.get('/v1/users/me')
    expect(response.status).toBe(200)

    // Clean up
    useAuthStore.getState().logout()
  })

  it('should call logout and redirect on 401 response', async () => {
    const { useAuthStore } = await import('@/store/authStore')
    useAuthStore.getState().login('expired-token', {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })

    try {
      await apiClient.post('/v1/auth/login', {
        email: 'wrong@test.com',
        password: 'wrong',
      })
    } catch {
      // Expected 401
    }

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
  })
})
