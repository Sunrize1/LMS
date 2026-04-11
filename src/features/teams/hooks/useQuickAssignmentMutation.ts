import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiQuickAssignments } from '@/services/apiQuickAssignments'
import { handleApiError } from '@/utils/handleApiError'
import type { CreateQuickAssignmentRequest } from '@/types/requests'

export function useQuickAssignmentMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: CreateQuickAssignmentRequest) => apiQuickAssignments.create(classId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['assignments', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
