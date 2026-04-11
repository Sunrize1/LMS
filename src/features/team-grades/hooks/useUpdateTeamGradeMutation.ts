import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeamGrades } from '@/services/apiTeamGrades'
import { handleApiError } from '@/utils/handleApiError'
import type { UpdateTeamGradeRequest } from '@/types/requests'

export function useUpdateTeamGradeMutation(assignmentId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: ({ teamGradeId, data }: { teamGradeId: string; data: UpdateTeamGradeRequest }) =>
      apiTeamGrades.update(assignmentId, teamGradeId, data),
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
