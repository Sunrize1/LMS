import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useRemoveMemberMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async (memberId: string) => {
      await apiClient.delete(`/v1/classes/${classId}/members/${memberId}`)
    },
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['members', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
