import { useQuery } from '@tanstack/react-query'
import { apiRubricTemplates } from '@/services/apiRubricTemplates'

export function useRubricTemplatesQuery(classId: string, enabled = true) {
  return useQuery({
    queryKey: ['rubricTemplates', classId],
    queryFn: () => apiRubricTemplates.listByClass(classId),
    enabled: !!classId && enabled,
  })
}
