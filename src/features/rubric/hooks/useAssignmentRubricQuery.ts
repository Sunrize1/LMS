import { useQuery } from '@tanstack/react-query'
import { apiRubrics } from '@/services/apiRubrics'

export function useAssignmentRubricQuery(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['assignmentRubric', assignmentId],
    queryFn: () => apiRubrics.getByAssignment(assignmentId),
    enabled: !!assignmentId && enabled,
  })
}
