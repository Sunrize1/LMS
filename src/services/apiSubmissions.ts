import { apiClient } from './apiClient'
import type { SubmissionDto, Page } from '@/types/dto'
import type { GradeRequest } from '@/types/requests'

export interface SubmissionsParams {
  page?: number
  size?: number
  graded?: boolean
}

export const apiSubmissions = {
  getByAssignmentId: async (
    assignmentId: string,
    params: SubmissionsParams = {},
  ): Promise<Page<SubmissionDto>> => {
    const { page = 0, size = 10, graded } = params
    const response = await apiClient.get<Page<SubmissionDto>>(
      `/v1/assignments/${assignmentId}/submissions`,
      { params: { page, size, ...(graded !== undefined && { graded }) } },
    )
    return response.data
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
