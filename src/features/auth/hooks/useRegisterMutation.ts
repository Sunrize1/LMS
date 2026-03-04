import { useMutation } from '@tanstack/react-query'
import { apiAuth } from '@/services/apiAuth'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/utils/handleApiError'
import type { RegisterRequest } from '@/types/requests'

export function useRegisterMutation() {
  const login = useAuthStore((s) => s.login)

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => apiAuth.register(data),
    onSuccess: (response) => {
      login(response.token, response.user)
    },
  })

  return {
    ...mutation,
    errorMessage: mutation.error ? handleApiError(mutation.error) : null,
  }
}
