import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/apiClient'
import type { SubmissionDto } from '@/types/dto'

export function useSubmissionQuery(submissionId: string) {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      const response = await apiClient.get<SubmissionDto>(`/v1/submissions/${submissionId}`)
      return response.data
    },
  })
}
