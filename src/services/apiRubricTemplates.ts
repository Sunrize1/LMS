import { apiClient } from './apiClient'
import type { RubricTemplateDto, RubricTemplateShortDto, RubricExportPayload } from '@/types/dto'
import type {
  CreateRubricTemplateRequest,
  UpdateRubricTemplateRequest,
} from '@/types/requests'

export const apiRubricTemplates = {
  listByClass: async (classId: string): Promise<RubricTemplateShortDto[]> => {
    const response = await apiClient.get<RubricTemplateShortDto[]>(
      `/v1/classes/${classId}/rubric-templates`,
    )
    return response.data
  },

  getById: async (id: string): Promise<RubricTemplateDto> => {
    const response = await apiClient.get<RubricTemplateDto>(`/v1/rubric-templates/${id}`)
    return response.data
  },

  create: async (
    classId: string,
    data: CreateRubricTemplateRequest,
  ): Promise<RubricTemplateDto> => {
    const response = await apiClient.post<RubricTemplateDto>(
      `/v1/classes/${classId}/rubric-templates`,
      data,
    )
    return response.data
  },

  update: async (id: string, data: UpdateRubricTemplateRequest): Promise<RubricTemplateDto> => {
    const response = await apiClient.put<RubricTemplateDto>(`/v1/rubric-templates/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/rubric-templates/${id}`)
  },

  exportTemplate: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/v1/rubric-templates/${id}/export`, {
      responseType: 'blob',
    })
    return response.data
  },

  importFromFile: async (classId: string, file: File): Promise<RubricTemplateDto> => {
    const form = new FormData()
    form.append('file', file)
    const response = await apiClient.post<RubricTemplateDto>(
      `/v1/classes/${classId}/rubric-templates/import`,
      form,
    )
    return response.data
  },

  importFromJson: async (
    classId: string,
    payload: RubricExportPayload,
  ): Promise<RubricTemplateDto> => {
    const response = await apiClient.post<RubricTemplateDto>(
      `/v1/classes/${classId}/rubric-templates/import`,
      payload,
    )
    return response.data
  },
}
