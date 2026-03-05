import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import type { MemberDto } from '@/types/dto'

export function useMembersQuery(classId: string) {
  return useQuery({
    queryKey: ['members', classId],
    queryFn: async () => {
      const response = await apiClient.get<MemberDto[]>(`/v1/classes/${classId}/members`)
      return response.data
    },
  })
}
