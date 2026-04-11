import { apiClient } from './apiClient'
import type { QuickAssignmentDto } from '@/types/dto'
import type { CreateQuickAssignmentRequest } from '@/types/requests'

export const apiQuickAssignments = {
  create: async (
    classId: string,
    data: CreateQuickAssignmentRequest,
  ): Promise<QuickAssignmentDto> => {
    const response = await apiClient.post<QuickAssignmentDto>(
      `/v1/classes/${classId}/quick-assignments`,
      data,
    )
    return response.data
  },
}
