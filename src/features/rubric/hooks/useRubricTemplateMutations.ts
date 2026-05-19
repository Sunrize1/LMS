import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiRubricTemplates } from '@/services/apiRubricTemplates'
import { handleApiError } from '@/utils/handleApiError'
import type {
  CreateRubricTemplateRequest,
  UpdateRubricTemplateRequest,
} from '@/types/requests'

export function useCreateRubricTemplateMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (data: CreateRubricTemplateRequest) =>
      apiRubricTemplates.create(classId, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['rubricTemplates', classId] })
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}

export function useUpdateRubricTemplateMutation(id: string, classId?: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (data: UpdateRubricTemplateRequest) =>
      apiRubricTemplates.update(id, data),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['rubricTemplate', id] })
      if (classId) {
        queryClient.invalidateQueries({ queryKey: ['rubricTemplates', classId] })
      }
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}

export function useDeleteRubricTemplateMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (id: string) => apiRubricTemplates.delete(id),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['rubricTemplates', classId] })
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}

export function useImportRubricTemplateMutation(classId: string) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (file: File) => apiRubricTemplates.importFromFile(classId, file),
    onSuccess: () => {
      setErrorMessage(null)
      queryClient.invalidateQueries({ queryKey: ['rubricTemplates', classId] })
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}
