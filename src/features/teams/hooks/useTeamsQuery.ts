import { useQuery } from '@tanstack/react-query'
import { apiTeams } from '@/services/apiTeams'

export function useTeamsQuery(classId: string, assignmentId?: string, page = 0, size = 20) {
  return useQuery({
    queryKey: ['teams', classId, assignmentId, page, size],
    queryFn: () => apiTeams.getByClassId(classId, { assignmentId, page, size }),
    enabled: !!classId,
  })
}
