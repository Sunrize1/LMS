import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'
import { handleApiError } from '@/utils/handleApiError'

export function useDeleteClassMutation() {
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (classId: string) => apiClasses.deleteClass(classId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? handleApiError(mutation.error) : null,
  }
}
