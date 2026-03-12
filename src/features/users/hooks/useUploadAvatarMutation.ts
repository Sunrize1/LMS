import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiUsers } from '@/services/apiUsers'
import { useAuthStore } from '@/store/authStore'
import { handleApiError } from '@/utils/handleApiError'
import { useState } from 'react'

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (file: File) => apiUsers.uploadAvatar(file),
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
