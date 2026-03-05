import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiAssignments } from '@/services/apiAssignments'
import type { CreateAssignmentRequest } from '@/types/requests'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useCreateAssignmentMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: CreateAssignmentRequest) => apiAssignments.create(classId, data),
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
