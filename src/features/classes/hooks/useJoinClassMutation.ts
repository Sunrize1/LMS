import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'
import { handleApiError } from '@/utils/handleApiError'
import type { JoinClassRequest } from '@/types/requests'

export function useJoinClassMutation() {
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: JoinClassRequest) => apiClasses.joinClass(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? handleApiError(mutation.error) : null,
  }
}
