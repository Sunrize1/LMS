import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeamGrades } from '@/services/apiTeamGrades'
import { handleApiError } from '@/utils/handleApiError'
import type { CreateTeamGradeRequest } from '@/types/requests'

export function useCreateTeamGradeMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: CreateTeamGradeRequest) => apiTeamGrades.create(assignmentId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['teamGrades', assignmentId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
