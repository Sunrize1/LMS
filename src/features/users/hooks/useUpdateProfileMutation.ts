import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUsers } from '@/services/apiUsers'
import type { UpdateProfileRequest } from '@/types/requests'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => apiUsers.updateMe(data),
    onSuccess: (user) => {
      setErrorMessage(null)
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      setErrorMessage(handleApiError(error))
    },
  })

  return { ...mutation, errorMessage }
}
