import { useAuthStore } from '@/store/authStore'
import * as authService from '@/services/auth.service'
import { ApiError } from '@/services/api'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)

  const isAuthenticated = user !== null && accessToken !== null

  async function loginWithCredentials(email: string, password: string) {
    const response = await authService.login({ email, password })
    setSession(
      {
        id: response.userId,
        username: response.username,
        profilePictureUrl: response.profilePictureUrl,
      },
      response.accessToken,
    )
    return response
  }

  async function registerWithCredentials(username: string, email: string, password: string) {
    const response = await authService.register({ username, email, password })
    setSession(
      {
        id: response.userId,
        username: response.username,
        profilePictureUrl: response.profilePictureUrl,
      },
      response.accessToken,
    )
    return response
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }

  return {
    user,
    isAuthenticated,
    isInitializing,
    loginWithCredentials,
    registerWithCredentials,
    logout,
  }
}

export { ApiError }
