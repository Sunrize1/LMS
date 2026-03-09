import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSubmissions } from '@/services/apiSubmissions'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useCancelSubmissionMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => apiSubmissions.cancelMy(assignmentId),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['submission', 'my', assignmentId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
