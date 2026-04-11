import { useQuery } from '@tanstack/react-query'
import { apiTeams } from '@/services/apiTeams'

export function useTeamQuery(classId: string, teamId: string) {
  return useQuery({
    queryKey: ['team', classId, teamId],
    queryFn: () => apiTeams.getById(classId, teamId),
    enabled: !!classId && !!teamId,
  })
}
