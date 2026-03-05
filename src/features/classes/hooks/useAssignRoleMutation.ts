import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import type { AssignRoleRequest } from '@/types/requests'
import type { MemberDto } from '@/types/dto'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useAssignRoleMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: AssignRoleRequest['role'] }) => {
      const response = await apiClient.put<MemberDto>(
        `/v1/classes/${classId}/members/${memberId}/role`,
        { role } satisfies AssignRoleRequest,
      )
      return response.data
    },
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['members', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
