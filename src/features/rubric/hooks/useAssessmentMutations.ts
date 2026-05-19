import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiAssessments } from '@/services/apiAssessments'
import { handleApiError } from '@/utils/handleApiError'
import type { CreateAssessmentRequest, UpdateAssessmentRequest } from '@/types/requests'

interface CreateOpts {
  assignmentId: string
  submissionId?: string
  teamGradeId?: string
}

export function useCreateAssessmentMutation({ assignmentId, submissionId, teamGradeId }: CreateOpts) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (data: CreateAssessmentRequest) =>
      apiAssessments.create(assignmentId, data),
    onSuccess: () => {
      setErrorMessage(null)
      if (submissionId) {
        queryClient.invalidateQueries({
          queryKey: ['assessment', 'submission', submissionId],
        })
        queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] })
      }
      if (teamGradeId) {
        queryClient.invalidateQueries({
          queryKey: ['assessment', 'teamGrade', teamGradeId],
        })
        queryClient.invalidateQueries({ queryKey: ['teamGrades', assignmentId] })
      }
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}

export function useUpdateAssessmentMutation(opts: CreateOpts & { assessmentId: string }) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (data: UpdateAssessmentRequest) =>
      apiAssessments.update(opts.assessmentId, data),
    onSuccess: () => {
      setErrorMessage(null)
      if (opts.submissionId) {
        queryClient.invalidateQueries({
          queryKey: ['assessment', 'submission', opts.submissionId],
        })
        queryClient.invalidateQueries({ queryKey: ['submissions', opts.assignmentId] })
      }
      if (opts.teamGradeId) {
        queryClient.invalidateQueries({
          queryKey: ['assessment', 'teamGrade', opts.teamGradeId],
        })
        queryClient.invalidateQueries({ queryKey: ['teamGrades', opts.assignmentId] })
      }
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}

export function useDeleteAssessmentMutation(opts: CreateOpts) {
  const queryClient = useQueryClient()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: (assessmentId: string) => apiAssessments.delete(assessmentId),
    onSuccess: () => {
      setErrorMessage(null)
      if (opts.submissionId) {
        queryClient.invalidateQueries({
          queryKey: ['assessment', 'submission', opts.submissionId],
        })
        queryClient.invalidateQueries({ queryKey: ['submissions', opts.assignmentId] })
      }
      if (opts.teamGradeId) {
        queryClient.invalidateQueries({
          queryKey: ['assessment', 'teamGrade', opts.teamGradeId],
        })
        queryClient.invalidateQueries({ queryKey: ['teamGrades', opts.assignmentId] })
      }
    },
    onError: (error) => setErrorMessage(handleApiError(error)),
  })
  return { ...mutation, errorMessage }
}
