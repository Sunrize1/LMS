import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeams } from '@/services/apiTeams'
import { handleApiError } from '@/utils/handleApiError'
import type { UpdateTeamRequest } from '@/types/requests'

export function useUpdateTeamMutation(classId: string, teamId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: UpdateTeamRequest) => apiTeams.update(classId, teamId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['teams', classId] })
      queryClient.invalidateQueries({ queryKey: ['team', classId, teamId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
