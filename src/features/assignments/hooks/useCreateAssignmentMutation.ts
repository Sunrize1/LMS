import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiAssignments } from '@/services/apiAssignments'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

interface CreateAssignmentInput {
  title: string
  description?: string
  deadline?: string
  files?: File[]
}

export function useCreateAssignmentMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: ({ files, ...data }: CreateAssignmentInput) =>
      apiAssignments.create(classId, data, files),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['assignments', classId] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
