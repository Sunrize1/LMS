import { useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/services/apiAuth'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/utils/handleApiError'
import type { LoginRequest } from '@/types/requests'

export function useLoginMutation() {
  const login = useAuthStore((s) => s.login)

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => apiAuth.login(data),
    onSuccess: (response) => {
      login(response.token, response.user)
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? handleApiError(mutation.error) : null,
  }
}
