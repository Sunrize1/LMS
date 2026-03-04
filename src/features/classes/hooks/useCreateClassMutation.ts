import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'
import { handleApiError } from '@/utils/handleApiError'
import type { CreateClassRequest } from '@/types/requests'

export function useCreateClassMutation() {
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateClassRequest) => apiClasses.createClass(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? handleApiError(mutation.error) : null,
  }
}
