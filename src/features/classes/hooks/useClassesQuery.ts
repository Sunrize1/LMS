import { useQuery } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'

export function useClassesQuery(page = 0, size = 20) {
  return useQuery({
    queryKey: ['classes', page, size],
    queryFn: () => apiClasses.getMyClasses(page, size),
  })
}
