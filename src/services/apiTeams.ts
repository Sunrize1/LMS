import { apiClient } from './apiClient'
import type { TeamDto, TeamListItemDto, ShuffleResponse, Page } from '@/types/dto'
import type {
  CreateTeamRequest,
  UpdateTeamRequest,
  AddTeamMemberRequest,
  ShuffleRequest,
} from '@/types/requests'

export const apiTeams = {
  getByClassId: async (
    classId: string,
    params?: { assignmentId?: string; page?: number; size?: number },
  ): Promise<Page<TeamListItemDto>> => {
    const response = await apiClient.get<Page<TeamListItemDto>>(
      `/v1/classes/${classId}/teams`,
      { params },
    )
    return response.data
  },

  getById: async (classId: string, teamId: string): Promise<TeamDto> => {
    const response = await apiClient.get<TeamDto>(
      `/v1/classes/${classId}/teams/${teamId}`,
    )
    return response.data
  },

  create: async (classId: string, data: CreateTeamRequest): Promise<TeamDto> => {
    const response = await apiClient.post<TeamDto>(
      `/v1/classes/${classId}/teams`,
      data,
    )
    return response.data
  },

  update: async (classId: string, teamId: string, data: UpdateTeamRequest): Promise<TeamDto> => {
    const response = await apiClient.put<TeamDto>(
      `/v1/classes/${classId}/teams/${teamId}`,
      data,
    )
    return response.data
  },

  delete: async (classId: string, teamId: string): Promise<void> => {
    await apiClient.delete(`/v1/classes/${classId}/teams/${teamId}`)
  },

  shuffle: async (classId: string, data: ShuffleRequest): Promise<ShuffleResponse> => {
    const response = await apiClient.post<ShuffleResponse>(
      `/v1/classes/${classId}/teams/shuffle`,
      data,
    )
    return response.data
  },

  getMyTeams: async (classId: string): Promise<TeamDto[]> => {
    const response = await apiClient.get<TeamDto[]>(
      `/v1/classes/${classId}/teams/my`,
    )
    return response.data
  },

  addMember: async (
    classId: string,
    teamId: string,
    data: AddTeamMemberRequest,
  ): Promise<TeamDto> => {
    const response = await apiClient.post<TeamDto>(
      `/v1/classes/${classId}/teams/${teamId}/members`,
      data,
    )
    return response.data
  },

  removeMember: async (classId: string, teamId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/v1/classes/${classId}/teams/${teamId}/members/${userId}`)
  },
}
