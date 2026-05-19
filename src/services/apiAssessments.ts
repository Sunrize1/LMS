import { apiClient } from './apiClient'
import type { AssessmentDto, MyAssessmentDto } from '@/types/dto'
import type { CreateAssessmentRequest, UpdateAssessmentRequest } from '@/types/requests'

export const apiAssessments = {
  create: async (
    assignmentId: string,
    data: CreateAssessmentRequest,
  ): Promise<AssessmentDto> => {
    const response = await apiClient.post<AssessmentDto>(
      `/v1/assignments/${assignmentId}/assessments`,
      data,
    )
    return response.data
  },

  update: async (assessmentId: string, data: UpdateAssessmentRequest): Promise<AssessmentDto> => {
    const response = await apiClient.put<AssessmentDto>(
      `/v1/assessments/${assessmentId}`,
      data,
    )
    return response.data
  },

  getById: async (assessmentId: string): Promise<AssessmentDto> => {
    const response = await apiClient.get<AssessmentDto>(`/v1/assessments/${assessmentId}`)
    return response.data
  },

  delete: async (assessmentId: string): Promise<void> => {
    await apiClient.delete(`/v1/assessments/${assessmentId}`)
  },

  getBySubmission: async (submissionId: string): Promise<AssessmentDto | null> => {
    try {
      const response = await apiClient.get<AssessmentDto>(
        `/v1/submissions/${submissionId}/assessment`,
      )
      return response.data
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      if (err?.response?.status === 404) return null
      throw e
    }
  },

  getByTeamGrade: async (teamGradeId: string): Promise<AssessmentDto | null> => {
    try {
      const response = await apiClient.get<AssessmentDto>(
        `/v1/team-grades/${teamGradeId}/assessment`,
      )
      return response.data
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      if (err?.response?.status === 404) return null
      throw e
    }
  },

  listMy: async (): Promise<MyAssessmentDto[]> => {
    const response = await apiClient.get<MyAssessmentDto[]>(
      `/v1/submissions/my/assessments`,
    )
    return response.data
  },
}
