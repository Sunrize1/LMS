import { apiClient } from './apiClient'
import type { CommentDto, Page } from '@/types/dto'
import type { AddCommentRequest } from '@/types/requests'

export const apiComments = {
  getByAssignmentId: async (assignmentId: string): Promise<CommentDto[]> => {
    const response = await apiClient.get<Page<CommentDto>>(
      `/v1/assignments/${assignmentId}/comments`,
      { params: { page: 0, size: 100 } },
    )
    return response.data.content
  },

  add: async (assignmentId: string, data: AddCommentRequest): Promise<CommentDto> => {
    const response = await apiClient.post<CommentDto>(
      `/v1/assignments/${assignmentId}/comments`,
      data,
    )
    return response.data
  },
}
