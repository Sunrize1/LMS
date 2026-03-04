import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import type { ClassDto } from '@/types/dto'

export function useClassQuery(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      const response = await apiClient.get<ClassDto>(`/v1/classes/${classId}`)
      return response.data
    },
    enabled: !!classId,
  })
}
