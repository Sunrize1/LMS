import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'
import { handleApiError } from '@/utils/handleApiError'
import type { UpdateClassRequest } from '@/types/requests'

export function useUpdateClassMutation(classId: string) {
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: UpdateClassRequest) => apiClasses.updateClass(classId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['class', classId] })
      qc.invalidateQueries({ queryKey: ['classes'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? handleApiError(mutation.error) : null,
  }
}
