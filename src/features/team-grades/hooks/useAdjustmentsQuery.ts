import { useQuery } from '@tanstack/react-query'
import { apiTeamGrades } from '@/services/apiTeamGrades'

export function useAdjustmentsQuery(assignmentId: string, teamGradeId: string, enabled = true) {
  return useQuery({
    queryKey: ['adjustments', assignmentId, teamGradeId],
    queryFn: () => apiTeamGrades.getAdjustments(assignmentId, teamGradeId),
    enabled: !!assignmentId && !!teamGradeId && enabled,
  })
}
