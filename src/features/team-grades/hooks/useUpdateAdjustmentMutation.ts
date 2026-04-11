import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeamGrades } from '@/services/apiTeamGrades'
import { handleApiError } from '@/utils/handleApiError'
import type { UpdateAdjustmentRequest } from '@/types/requests'

export function useUpdateAdjustmentMutation(assignmentId: string, teamGradeId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: UpdateAdjustmentRequest }) =>
      apiTeamGrades.updateAdjustment(assignmentId, teamGradeId, studentId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['adjustments', assignmentId, teamGradeId] })
      queryClient.invalidateQueries({ queryKey: ['teamGrades', assignmentId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
