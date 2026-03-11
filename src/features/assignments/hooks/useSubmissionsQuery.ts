import { useQuery } from '@tanstack/react-query'
import { apiSubmissions, type SubmissionsParams } from '@/services/apiSubmissions'

export function useSubmissionsQuery(
  assignmentId: string,
  enabled = true,
  params: SubmissionsParams = {},
) {
  return useQuery({
    queryKey: ['submissions', assignmentId, params],
    queryFn: () => apiSubmissions.getByAssignmentId(assignmentId, params),
    enabled,
  })
}
