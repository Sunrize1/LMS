import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import type { MemberDto, Page } from '@/types/dto'

export function useMembersQuery(classId: string) {
  return useQuery({
    queryKey: ['members', classId],
    queryFn: async () => {
      const response = await apiClient.get<Page<MemberDto>>(
        `/v1/classes/${classId}/members`,
        { params: { page: 0, size: 100 } },
      )
      return response.data.content
    },
  })
}
