import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiTeams } from '@/services/apiTeams'
import { handleApiError } from '@/utils/handleApiError'
import type { AddTeamMemberRequest } from '@/types/requests'

export function useAddTeamMemberMutation(classId: string, teamId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: AddTeamMemberRequest) => apiTeams.addMember(classId, teamId, data),
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
