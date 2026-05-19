import { useQuery } from '@tanstack/react-query'
import { apiAssessments } from '@/services/apiAssessments'

export function useSubmissionAssessmentQuery(submissionId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['assessment', 'submission', submissionId],
    queryFn: () => apiAssessments.getBySubmission(submissionId!),
    enabled: !!submissionId && enabled,
  })
}

export function useTeamGradeAssessmentQuery(teamGradeId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['assessment', 'teamGrade', teamGradeId],
    queryFn: () => apiAssessments.getByTeamGrade(teamGradeId!),
    enabled: !!teamGradeId && enabled,
  })
}

export function useMyAssessmentsQuery(enabled = true) {
  return useQuery({
    queryKey: ['myAssessments'],
    queryFn: () => apiAssessments.listMy(),
    enabled,
  })
}
