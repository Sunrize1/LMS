import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAssignRoleMutation } from '@/features/classes/hooks/useAssignRoleMutation'
import { useUpdateClassMutation } from '@/features/classes/hooks/useUpdateClassMutation'
import { useRemoveMemberMutation } from '@/features/classes/hooks/useRemoveMemberMutation'
import { useSubmitMutation } from '@/features/assignments/hooks/useSubmitMutation'
import { useCancelSubmissionMutation } from '@/features/assignments/hooks/useCancelSubmissionMutation'
import { useGradeMutation } from '@/features/submissions/hooks/useGradeMutation'
import { useAddCommentMutation } from '@/features/comments/hooks/useAddCommentMutation'
import { useUpdateProfileMutation } from '@/features/users/hooks/useUpdateProfileMutation'
import { useAuthStore } from '@/store/authStore'
import React from 'react'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('Mutation hooks', () => {
  beforeEach(() => {
    useAuthStore.getState().login('test-jwt-token', {
      id: '1',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      email: 'user@test.com',
      avatarUrl: null,
      dateOfBirth: null,
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('useAssignRoleMutation should assign role', async () => {
    const { result } = renderHook(() => useAssignRoleMutation('cls-2'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ memberId: 'mem-2', role: 'TEACHER' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useUpdateClassMutation should update class', async () => {
    const { result } = renderHook(() => useUpdateClassMutation('cls-2'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ name: 'Updated Class' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useRemoveMemberMutation should remove member', async () => {
    const { result } = renderHook(() => useRemoveMemberMutation('cls-2'), {
      wrapper: createWrapper(),
    })

    result.current.mutate('mem-2')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useSubmitMutation should submit answer', async () => {
    const { result } = renderHook(() => useSubmitMutation('asgn-1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ answerText: 'test answer' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useCancelSubmissionMutation should cancel submission', async () => {
    const { result } = renderHook(() => useCancelSubmissionMutation('asgn-1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useGradeMutation should grade submission', async () => {
    const { result } = renderHook(() => useGradeMutation('sub-1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ grade: 90 })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useAddCommentMutation should add comment', async () => {
    const { result } = renderHook(() => useAddCommentMutation('asgn-1'), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ text: 'New comment' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('useUpdateProfileMutation should update profile', async () => {
    const { result } = renderHook(() => useUpdateProfileMutation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ firstName: 'Updated', lastName: 'User' })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
