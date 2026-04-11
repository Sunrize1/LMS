import { useQuery } from '@tanstack/react-query'
import { apiTeamGrades } from '@/services/apiTeamGrades'

export function useMyTeamGradeQuery(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['myTeamGrade', assignmentId],
    queryFn: () => apiTeamGrades.getMyTeamGrade(assignmentId),
    enabled: !!assignmentId && enabled,
    retry: false,
  })
}
