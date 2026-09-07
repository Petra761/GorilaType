import { useAuthStore } from '@/store/authStore'
import type { ProblemDetails } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number
  problem: ProblemDetails | null

  constructor(status: number, problem: ProblemDetails | null, message: string) {
    super(message)
    this.status = status
    this.problem = problem
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  skipAuthRetry?: boolean
}

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      useAuthStore.getState().setSession(
        {
          id: data.userId,
          username: data.username,
          profilePictureUrl: data.profilePictureUrl,
        },
        data.accessToken,
      )

      return true
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function parseErrorResponse(response: Response): Promise<ProblemDetails | null> {
  try {
    return (await response.json()) as ProblemDetails
  } catch {
    return null
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { body, skipAuthRetry, headers, ...rest } = options
  const accessToken = useAuthStore.getState().accessToken

  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...headers,
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && !skipAuthRetry) {
    const refreshed = await refreshAccessToken()

    if (refreshed) {
      return apiRequest<TResponse>(path, { ...options, skipAuthRetry: true })
    }

    useAuthStore.getState().clearSession()
    const problem = await parseErrorResponse(response)
    throw new ApiError(401, problem, problem?.detail ?? 'Sesión expirada.')
  }

  if (!response.ok) {
    const problem = await parseErrorResponse(response)
    throw new ApiError(response.status, problem, problem?.detail ?? 'Ocurrió un error inesperado.')
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}
