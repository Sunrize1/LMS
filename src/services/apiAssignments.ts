import { apiClient } from './apiClient'
import type { AssignmentDto, AssignmentDetailDto, Page } from '@/types/dto'
import type { CreateAssignmentRequest } from '@/types/requests'

export const apiAssignments = {
  getByClassId: async (classId: string): Promise<AssignmentDto[]> => {
    const response = await apiClient.get<Page<AssignmentDto>>(
      `/v1/classes/${classId}/assignments`,
      { params: { page: 0, size: 100 } },
    )
    return response.data.content
  },

  getById: async (assignmentId: string): Promise<AssignmentDetailDto> => {
    const response = await apiClient.get<AssignmentDetailDto>(
      `/v1/assignments/${assignmentId}`,
    )
    return response.data
  },

  create: async (classId: string, data: CreateAssignmentRequest): Promise<AssignmentDto> => {
    const response = await apiClient.post<AssignmentDto>(
      `/v1/classes/${classId}/assignments`,
      data,
    )
    return response.data
  },
}
