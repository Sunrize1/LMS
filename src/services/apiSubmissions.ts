import { apiClient } from './apiClient'
import type { SubmissionDto } from '@/types/dto'
import type { GradeRequest } from '@/types/requests'

export const apiSubmissions = {
  getByAssignmentId: async (assignmentId: string): Promise<SubmissionDto[]> => {
    const response = await apiClient.get<SubmissionDto[]>(
      `/v1/assignments/${assignmentId}/submissions`,
    )
    return response.data
  },

  getMy: async (assignmentId: string): Promise<SubmissionDto> => {
    const response = await apiClient.get<SubmissionDto>(
      `/v1/assignments/${assignmentId}/submissions/my`,
    )
    return response.data
  },

  submit: async (assignmentId: string, formData: FormData): Promise<SubmissionDto> => {
    const response = await apiClient.post<SubmissionDto>(
      `/v1/assignments/${assignmentId}/submissions`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data
  },

  grade: async (submissionId: string, data: GradeRequest): Promise<SubmissionDto> => {
    const response = await apiClient.put<SubmissionDto>(
      `/v1/submissions/${submissionId}/grade`,
      data,
    )
    return response.data
  },
}
