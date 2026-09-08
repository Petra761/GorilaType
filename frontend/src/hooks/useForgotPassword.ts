import { useState } from 'react'
import * as authService from '@/services/auth.service'
import { ApiError } from '@/services/api'

export function useForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function submit(email: string) {
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await authService.forgotPassword({ email })
      setSuccessMessage(response.message)
      return true
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo procesar la solicitud.'
      setErrorMessage(message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, errorMessage, successMessage }
}
