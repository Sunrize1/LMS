import { apiClient } from './apiClient'
import type { AuthResponse } from '@/types/dto'
import type { LoginRequest, RegisterRequest } from '@/types/requests'

export const apiAuth = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', data)
    return response.data
  },
}
