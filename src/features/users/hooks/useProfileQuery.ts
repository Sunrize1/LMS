import { useQuery } from '@tanstack/react-query'
import { apiUsers } from '@/services/apiUsers'

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiUsers.getMe(),
  })
}
