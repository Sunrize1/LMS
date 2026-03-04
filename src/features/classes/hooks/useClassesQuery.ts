import { useQuery } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'

export function useClassesQuery() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: apiClasses.getMyClasses,
  })
}
