import { useQuery } from '@tanstack/react-query'
import { apiAssignments } from '@/services/apiAssignments'

export function useAssignmentsQuery(classId: string) {
  return useQuery({
    queryKey: ['assignments', classId],
    queryFn: () => apiAssignments.getByClassId(classId),
    enabled: !!classId,
  })
}
