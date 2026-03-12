import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { useClassesQuery } from '@/features/classes/hooks/useClassesQuery'
import { createElement } from 'react'

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useClassesQuery', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should fetch and return paginated list of classes', async () => {
    const { result } = renderHook(() => useClassesQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data!.content).toHaveLength(2)
    expect(result.current.data!.content[0].name).toBe('Math 101')
    expect(result.current.data!.content[1].name).toBe('Physics 201')
  })
})
