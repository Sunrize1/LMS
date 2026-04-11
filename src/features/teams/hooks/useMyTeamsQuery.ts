import { useQuery } from '@tanstack/react-query'
import { apiTeams } from '@/services/apiTeams'

export function useMyTeamsQuery(classId: string, enabled = true) {
  return useQuery({
    queryKey: ['myTeams', classId],
    queryFn: () => apiTeams.getMyTeams(classId),
    enabled: !!classId && enabled,
  })
}
