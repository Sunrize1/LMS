import { AxiosError } from 'axios'
import type { ApiError } from '@/types/dto'

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.'
    }

    const data = error.response?.data as ApiError | undefined
    if (data?.message) {
      return data.message
    }
  }

  return 'An unexpected error occurred.'
}
