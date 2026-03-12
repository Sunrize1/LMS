import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClasses } from '@/services/apiClasses'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useRegenerateCodeMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => apiClasses.regenerateCode(classId),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['class', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
