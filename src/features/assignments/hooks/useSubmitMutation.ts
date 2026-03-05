import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSubmissions } from '@/services/apiSubmissions'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useSubmitMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (formData: FormData) => apiSubmissions.submit(assignmentId, formData),
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
