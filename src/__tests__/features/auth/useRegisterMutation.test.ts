import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import { useRegisterMutation } from '@/features/auth/hooks/useRegisterMutation'
import { createElement } from 'react'

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useRegisterMutation', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    queryClient.clear()
  })

  it('should call authStore.login on successful registration', async () => {
    const { result } = renderHook(() => useRegisterMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      firstName: 'New',
      lastName: 'User',
      email: 'new@test.com',
      password: 'password123',
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().token).toBe('test-jwt-token')
    expect(useAuthStore.getState().user?.firstName).toBe('New')
  })
})
