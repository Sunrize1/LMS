import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSubmissions } from '@/services/apiSubmissions'
import type { GradeRequest } from '@/types/requests'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useGradeMutation(submissionId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: GradeRequest) => apiSubmissions.grade(submissionId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
