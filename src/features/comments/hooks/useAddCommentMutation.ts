import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiComments } from '@/services/apiComments'
import type { AddCommentRequest } from '@/types/requests'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useAddCommentMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: AddCommentRequest) => apiComments.add(assignmentId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['comments', assignmentId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
