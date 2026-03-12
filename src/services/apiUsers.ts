import { apiClient } from './apiClient'
import type { UserDto } from '@/types/dto'
import type { UpdateProfileRequest } from '@/types/requests'

export const apiUsers = {
  getMe: async (): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>('/v1/users/me')
    return response.data
  },

  updateMe: async (data: UpdateProfileRequest): Promise<UserDto> => {
    const response = await apiClient.put<UserDto>('/v1/users/me', data)
    return response.data
  },

  uploadAvatar: async (file: File): Promise<UserDto> => {
    const formData = new FormData()
    formData.append('file', file, file.name)
    const response = await apiClient.post<UserDto>('/v1/users/me/avatar', formData)
    return response.data
  },
}
