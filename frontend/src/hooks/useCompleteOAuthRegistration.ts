import { useState } from 'react'
import { useNavigate } from 'react-router'
import * as authService from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { ApiError } from '@/services/api'

export function useCompleteOAuthRegistration() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function submit(pendingToken: string, username: string) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await authService.completeOAuthRegistration({
        pendingToken,
        username,
      })

      setSession(
        {
          id: response.userId,
          username: response.username,
          profilePictureUrl: response.profilePictureUrl,
        },
        response.accessToken,
      )

      navigate('/', { replace: true })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo completar el registro.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, errorMessage }
}
