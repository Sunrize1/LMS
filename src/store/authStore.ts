import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDto } from '@/types/dto'
import { queryClient } from '@/services/queryClient'

export interface AuthState {
  token: string | null
  user: UserDto | null
  isAuthenticated: boolean
  login: (token: string, user: UserDto) => void
  logout: () => void
  setUser: (user: UserDto) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      logout: () => {
        queryClient.clear()
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'lms_token',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
