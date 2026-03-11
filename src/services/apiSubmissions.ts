import { apiClient } from './apiClient'
import type { SubmissionDto, Page } from '@/types/dto'
import type { GradeRequest } from '@/types/requests'

export interface SubmissionsParams {
  graded?: boolean
}

export const apiSubmissions = {
  getByAssignmentId: async (
    assignmentId: string,
    params: SubmissionsParams = {},
  ): Promise<SubmissionDto[]> => {
    const { graded } = params
    const response = await apiClient.get<Page<SubmissionDto>>(
      `/v1/assignments/${assignmentId}/submissions`,
      { params: { page: 0, size: 100, ...(graded !== undefined && { graded }) } },
    )
    return response.data.content
  },

  getMy: async (assignmentId: string): Promise<SubmissionDto> => {
    const response = await apiClient.get<SubmissionDto>(
      `/v1/assignments/${assignmentId}/submissions/my`,
    )
    return response.data
  },

  submit: async (
    assignmentId: string,
    answerText: string,
    file?: File,
  ): Promise<SubmissionDto> => {
    const formData = new FormData()
    formData.append('answerText', answerText)
    if (file) {
      formData.append('file', file, file.name)
    }
    const response = await apiClient.post<SubmissionDto>(
      `/v1/assignments/${assignmentId}/submissions`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data
  },

  cancelMy: async (assignmentId: string): Promise<void> => {
    await apiClient.delete(`/v1/assignments/${assignmentId}/submissions/my`)
  },

  grade: async (submissionId: string, data: GradeRequest): Promise<SubmissionDto> => {
    const response = await apiClient.put<SubmissionDto>(
      `/v1/submissions/${submissionId}/grade`,
      data,
    )
    return response.data
  },
}
