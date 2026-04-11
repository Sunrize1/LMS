import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeams } from '@/services/apiTeams'
import { handleApiError } from '@/utils/handleApiError'

export function useRemoveTeamMemberMutation(classId: string, teamId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (userId: string) => apiTeams.removeMember(classId, teamId, userId),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['team', classId, teamId] })
      queryClient.invalidateQueries({ queryKey: ['teams', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
