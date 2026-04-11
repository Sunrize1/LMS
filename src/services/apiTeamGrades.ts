import { apiClient } from './apiClient'
import type {
  TeamGradeDto,
  TeamGradeListItemDto,
  IndividualAdjustmentDto,
  MyTeamGradeDto,
  Page,
} from '@/types/dto'
import type {
  CreateTeamGradeRequest,
  UpdateTeamGradeRequest,
  UpdateAdjustmentRequest,
} from '@/types/requests'

export const apiTeamGrades = {
  create: async (assignmentId: string, data: CreateTeamGradeRequest): Promise<TeamGradeDto> => {
    const response = await apiClient.post<TeamGradeDto>(
      `/v1/assignments/${assignmentId}/team-grades`,
      data,
    )
    return response.data
  },

  getByAssignmentId: async (
    assignmentId: string,
    params?: { page?: number; size?: number },
  ): Promise<Page<TeamGradeListItemDto>> => {
    const response = await apiClient.get<Page<TeamGradeListItemDto>>(
      `/v1/assignments/${assignmentId}/team-grades`,
      { params },
    )
    return response.data
  },

  update: async (
    assignmentId: string,
    teamGradeId: string,
    data: UpdateTeamGradeRequest,
  ): Promise<TeamGradeDto> => {
    const response = await apiClient.put<TeamGradeDto>(
      `/v1/assignments/${assignmentId}/team-grades/${teamGradeId}`,
      data,
    )
    return response.data
  },

  getAdjustments: async (
    assignmentId: string,
    teamGradeId: string,
  ): Promise<IndividualAdjustmentDto[]> => {
    const response = await apiClient.get<IndividualAdjustmentDto[]>(
      `/v1/assignments/${assignmentId}/team-grades/${teamGradeId}/adjustments`,
    )
    return response.data
  },

  updateAdjustment: async (
    assignmentId: string,
    teamGradeId: string,
    studentId: string,
    data: UpdateAdjustmentRequest,
  ): Promise<IndividualAdjustmentDto> => {
    const response = await apiClient.put<IndividualAdjustmentDto>(
      `/v1/assignments/${assignmentId}/team-grades/${teamGradeId}/adjustments/${studentId}`,
      data,
    )
    return response.data
  },

  getMyTeamGrade: async (assignmentId: string): Promise<MyTeamGradeDto> => {
    const response = await apiClient.get<MyTeamGradeDto>(
      `/v1/assignments/${assignmentId}/my-team-grade`,
    )
    return response.data
  },
}
