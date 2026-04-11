import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeams } from '@/services/apiTeams'
import { handleApiError } from '@/utils/handleApiError'
import type { CreateTeamRequest } from '@/types/requests'

export function useCreateTeamMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: CreateTeamRequest) => apiTeams.create(classId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['teams', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
