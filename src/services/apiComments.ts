import { apiClient } from './apiClient'
import type { CommentDto } from '@/types/dto'
import type { AddCommentRequest } from '@/types/requests'

export const apiComments = {
  getByAssignmentId: async (assignmentId: string): Promise<CommentDto[]> => {
    const response = await apiClient.get<CommentDto[]>(
      `/v1/assignments/${assignmentId}/comments`,
    )
    return response.data
  },

  add: async (assignmentId: string, data: AddCommentRequest): Promise<CommentDto> => {
    const response = await apiClient.post<CommentDto>(
      `/v1/assignments/${assignmentId}/comments`,
      data,
    )
    return response.data
  },
}
