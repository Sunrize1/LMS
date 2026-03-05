import { useQuery } from '@tanstack/react-query'
import { apiComments } from '@/services/apiComments'

export function useCommentsQuery(assignmentId: string) {
  return useQuery({
    queryKey: ['comments', assignmentId],
    queryFn: () => apiComments.getByAssignmentId(assignmentId),
  })
}
