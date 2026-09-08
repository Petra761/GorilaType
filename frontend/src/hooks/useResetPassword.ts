import { useState } from 'react'
import { useNavigate } from 'react-router'
import * as authService from '@/services/auth.service'
import { ApiError } from '@/services/api'

export function useResetPassword() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function submit(email: string, code: string, newPassword: string) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await authService.resetPassword({ email, code, newPassword })
      navigate('/auth', {
        replace: true,
        state: { passwordResetSuccess: true },
      })
      return true
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo restablecer la contraseña.'
      setErrorMessage(message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, errorMessage }
}
