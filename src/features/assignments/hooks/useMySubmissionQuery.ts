import { useQuery } from '@tanstack/react-query'
import { apiSubmissions } from '@/services/apiSubmissions'

export function useMySubmissionQuery(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['submission', 'my', assignmentId],
    queryFn: () => apiSubmissions.getMy(assignmentId),
    enabled,
    retry: false,
  })
}
