import { useQuery } from '@tanstack/react-query'
import { apiRubricTemplates } from '@/services/apiRubricTemplates'

export function useRubricTemplateQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['rubricTemplate', id],
    queryFn: () => apiRubricTemplates.getById(id!),
    enabled: !!id,
  })
}
