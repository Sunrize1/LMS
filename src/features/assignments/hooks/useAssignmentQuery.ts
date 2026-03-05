import { useQuery } from '@tanstack/react-query'
import { apiAssignments } from '@/services/apiAssignments'

export function useAssignmentQuery(assignmentId: string) {
  return useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => apiAssignments.getById(assignmentId),
  })
}
