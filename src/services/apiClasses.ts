import { apiClient } from './apiClient'
import type { ClassDto, Page } from '@/types/dto'
import type { CreateClassRequest, JoinClassRequest, UpdateClassRequest } from '@/types/requests'

export const apiClasses = {
  getMyClasses: async (): Promise<ClassDto[]> => {
    const response = await apiClient.get<Page<ClassDto>>('/v1/classes', {
      params: { page: 0, size: 100 },
    })
    return response.data.content
  },

  createClass: async (data: CreateClassRequest): Promise<ClassDto> => {
    const response = await apiClient.post<ClassDto>('/v1/classes', data)
    return response.data
  },

  joinClass: async (data: JoinClassRequest): Promise<ClassDto> => {
    const response = await apiClient.post<ClassDto>('/v1/classes/join', data)
    return response.data
  },

  updateClass: async (classId: string, data: UpdateClassRequest): Promise<ClassDto> => {
    const response = await apiClient.put<ClassDto>(`/v1/classes/${classId}`, data)
    return response.data
  },

  deleteClass: async (classId: string): Promise<void> => {
    await apiClient.delete(`/v1/classes/${classId}`)
  },
}
