import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiRubrics } from '@/services/apiRubrics'
import { handleApiError } from '@/utils/handleApiError'
import type { AttachRubricRequest } from '@/types/requests'

export function useAttachRubricMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (data: AttachRubricRequest) => apiRubrics.attach(assignmentId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['assignmentRubric', assignmentId] })
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}

export function useDetachRubricMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: () => apiRubrics.detach(assignmentId),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['assignmentRubric', assignmentId] })
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}
