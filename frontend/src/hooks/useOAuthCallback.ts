import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router'
import * as authService from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { ApiError } from '@/services/api'
import type { OAuthProvider } from '@/types/auth'

type OAuthCallbackStatus = 'loading' | 'success' | 'username_required' | 'error'

interface OAuthCallbackState {
  status: OAuthCallbackStatus
  errorMessage: string | null
  pendingToken: string | null
  suggestedUsernames: string[]
}

export function useOAuthCallback() {
  const { provider } = useParams<{ provider: OAuthProvider }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  const [state, setState] = useState<OAuthCallbackState>({
    status: 'loading',
    errorMessage: null,
    pendingToken: null,
    suggestedUsernames: [],
  })

  useEffect(() => {
    const code = searchParams.get('code')

    if (!provider || !code) {
      setState({
        status: 'error',
        errorMessage: 'Faltan datos para completar la autenticación.',
        pendingToken: null,
        suggestedUsernames: [],
      })
      return
    }

    let cancelled = false

    async function exchangeCode() {
      try {
        const result = await authService.loginWithOAuth(provider!, { code: code! })

        if (cancelled) return

        if (result.usernameRequired) {
          setState({
            status: 'username_required',
            errorMessage: null,
            pendingToken: result.pendingToken ?? null,
            suggestedUsernames: result.suggestedUsernames ?? [],
          })
          return
        }

        if (result.auth) {
          setSession(
            {
              id: result.auth.userId,
              username: result.auth.username,
              profilePictureUrl: result.auth.profilePictureUrl,
            },
            result.auth.accessToken,
          )
          setState((prev) => ({ ...prev, status: 'success' }))
          navigate('/', { replace: true })
        }
      } catch (error) {
        if (cancelled) return

        const message =
          error instanceof ApiError ? error.message : 'No se pudo completar la autenticación.'

        setState({
          status: 'error',
          errorMessage: message,
          pendingToken: null,
          suggestedUsernames: [],
        })
      }
    }

    exchangeCode()

    return () => {
      cancelled = true
    }
  }, [provider, searchParams, setSession, navigate])

  return state
}
