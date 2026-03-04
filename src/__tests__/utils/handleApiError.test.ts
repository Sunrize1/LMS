import { describe, it, expect } from 'vitest'
import { AxiosError } from 'axios'
import { handleApiError } from '@/utils/handleApiError'

describe('handleApiError', () => {
  it('should extract message from API error response', () => {
    const error = new AxiosError('Request failed', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Validation failed', status: 400 },
      headers: {},
      config: {} as never,
    })

    const result = handleApiError(error)
    expect(result).toBe('Validation failed')
  })

  it('should return default message for network errors', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK')

    const result = handleApiError(error)
    expect(result).toBe('Network error. Please check your connection.')
  })

  it('should return generic message for unknown errors', () => {
    const error = new Error('Something unexpected')

    const result = handleApiError(error)
    expect(result).toBe('An unexpected error occurred.')
  })

  it('should handle 401 error message', () => {
    const error = new AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      statusText: 'Unauthorized',
      data: { message: 'Invalid credentials', status: 401 },
      headers: {},
      config: {} as never,
    })

    const result = handleApiError(error)
    expect(result).toBe('Invalid credentials')
  })

  it('should handle error without response data message', () => {
    const error = new AxiosError('Server Error', '500', undefined, undefined, {
      status: 500,
      statusText: 'Internal Server Error',
      data: {},
      headers: {},
      config: {} as never,
    })

    const result = handleApiError(error)
    expect(result).toBe('An unexpected error occurred.')
  })
})
