import { apiClient } from './apiClient'
import type { SubmissionDto, Page } from '@/types/dto'
import type { GradeRequest } from '@/types/requests'

export const apiSubmissions = {
  getByAssignmentId: async (assignmentId: string): Promise<SubmissionDto[]> => {
    const response = await apiClient.get<Page<SubmissionDto>>(
      `/v1/assignments/${assignmentId}/submissions`,
      { params: { page: 0, size: 100 } },
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
    const body = file ? file : undefined
    const response = await apiClient.post<SubmissionDto>(
      `/v1/assignments/${assignmentId}/submissions`,
      body,
      {
        params: { answerText },
        headers: file ? { 'Content-Type': 'multipart/form-data' } : undefined,
      },
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
