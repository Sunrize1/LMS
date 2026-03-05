import { useQuery } from '@tanstack/react-query'
import { apiSubmissions } from '@/services/apiSubmissions'

export function useMySubmissionQuery(assignmentId: string) {
  return useQuery({
    queryKey: ['submission', 'my', assignmentId],
    queryFn: () => apiSubmissions.getMy(assignmentId),
  })
}
