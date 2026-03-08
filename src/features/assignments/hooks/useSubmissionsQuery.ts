import { useQuery } from '@tanstack/react-query'
import { apiSubmissions } from '@/services/apiSubmissions'

export function useSubmissionsQuery(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: () => apiSubmissions.getByAssignmentId(assignmentId),
    enabled,
  })
}
