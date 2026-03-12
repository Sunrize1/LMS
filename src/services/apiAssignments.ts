import { apiClient } from './apiClient'
import type { AssignmentDto, AssignmentDetailDto, Page } from '@/types/dto'
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

  create: async (
    classId: string,
    data: { title: string; description?: string; deadline?: string },
    files?: File[],
  ): Promise<AssignmentDto> => {
    const formData = new FormData()
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    if (data.deadline) formData.append('deadline', data.deadline)
    if (files) {
      files.forEach((file) => formData.append('files', file, file.name))
    }
    const response = await apiClient.post<AssignmentDto>(
      `/v1/classes/${classId}/assignments`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return response.data
  },
}
