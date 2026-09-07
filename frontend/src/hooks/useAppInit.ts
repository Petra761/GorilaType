import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { apiRequest } from '@/services/api'
import type { AuthResponseDto } from '@/types/auth'

export function useAppInit() {
  const setSession = useAuthStore((state) => state.setSession)
  const setInitializing = useAuthStore((state) => state.setInitializing)

  useEffect(() => {
    let cancelled = false

    async function tryRestoreSession() {
      try {
        const response = await apiRequest<AuthResponseDto>('/auth/refresh', {
          method: 'POST',
          skipAuthRetry: true,
        })

        if (!cancelled) {
          setSession(
            {
              id: response.userId,
              username: response.username,
              profilePictureUrl: response.profilePictureUrl,
            },
            response.accessToken,
          )
        }
      } catch {
        // No hay sesión previa válida (o la cookie expiró) — comportamiento normal, no es un error a mostrar.
      } finally {
        if (!cancelled) {
          setInitializing(false)
        }
      }
    }

    tryRestoreSession()

    return () => {
      cancelled = true
    }
  }, [setSession, setInitializing])
}
