import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import type { MemberDto } from '@/types/dto'

export function useMemberQuery(classId: string, memberId: string) {
  return useQuery({
    queryKey: ['member', classId, memberId],
    queryFn: async () => {
      const response = await apiClient.get<MemberDto>(
        `/v1/classes/${classId}/members/${memberId}`,
      )
      return response.data
    },
  })
}
