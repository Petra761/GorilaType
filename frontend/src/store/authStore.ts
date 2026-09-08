import { create } from 'zustand'

interface AuthUser {
  id: string
  username: string
  profilePictureUrl: string | null
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isInitializing: boolean
  setSession: (user: AuthUser, accessToken: string) => void
  clearSession: () => void
  setInitializing: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isInitializing: true,
  setSession: (user, accessToken) => set({ user, accessToken }),
  clearSession: () => set({ user: null, accessToken: null }),
  setInitializing: (value) => set({ isInitializing: value }),
}))
