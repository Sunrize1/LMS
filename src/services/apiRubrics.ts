import { apiClient } from './apiClient'
import type { RubricDto } from '@/types/dto'
import type { AttachRubricRequest } from '@/types/requests'

export const apiRubrics = {
  attach: async (assignmentId: string, data: AttachRubricRequest): Promise<RubricDto> => {
    const response = await apiClient.post<RubricDto>(
      `/v1/assignments/${assignmentId}/rubric`,
      data,
    )
    return response.data
  },

  getByAssignment: async (assignmentId: string): Promise<RubricDto | null> => {
    try {
      const response = await apiClient.get<RubricDto>(`/v1/assignments/${assignmentId}/rubric`)
      return response.data
    } catch (e: unknown) {
      const err = e as { response?: { status?: number } }
      if (err?.response?.status === 404) return null
      throw e
    }
  },

  detach: async (assignmentId: string): Promise<void> => {
    await apiClient.delete(`/v1/assignments/${assignmentId}/rubric`)
  },
}
