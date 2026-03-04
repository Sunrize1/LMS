import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/store/authStore'
import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation'
import { createElement } from 'react'

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useLoginMutation', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    queryClient.clear()
  })

  it('should call authStore.login on successful mutation', async () => {
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ email: 'user@test.com', password: 'password123' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(useAuthStore.getState().token).toBe('test-jwt-token')
    expect(useAuthStore.getState().user?.firstName).toBe('Ivan')
  })

  it('should return error on invalid credentials', async () => {
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ email: 'wrong@test.com', password: 'wrong' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('should provide errorMessage from API response', async () => {
    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ email: 'wrong@test.com', password: 'wrong' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.errorMessage).toBe('Invalid credentials')
  })
})
