import { useQuery } from '@tanstack/react-query'
import { apiTeamGrades } from '@/services/apiTeamGrades'

export function useTeamGradesQuery(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['teamGrades', assignmentId],
    queryFn: () => apiTeamGrades.getByAssignmentId(assignmentId, { page: 0, size: 100 }),
    enabled: !!assignmentId && enabled,
  })
}
