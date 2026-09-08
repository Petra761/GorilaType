import { apiRequest } from '@/services/api'
import type {
  AuthResponseDto,
  RegisterRequestDto,
  LoginRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  OAuthLoginRequestDto,
  CompleteOAuthRegistrationRequestDto,
  OAuthResultDto,
  OAuthProvider,
} from '@/types/auth'

export function register(data: RegisterRequestDto): Promise<AuthResponseDto> {
  return apiRequest<AuthResponseDto>('/auth/register', {
    method: 'POST',
    body: data,
  })
}

export function login(data: LoginRequestDto): Promise<AuthResponseDto> {
  return apiRequest<AuthResponseDto>('/auth/login', {
    method: 'POST',
    body: data,
  })
}

export function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}

export function forgotPassword(data: ForgotPasswordRequestDto): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: data,
  })
}

export function resetPassword(data: ResetPasswordRequestDto): Promise<void> {
  return apiRequest<void>('/auth/reset-password', {
    method: 'POST',
    body: data,
  })
}

export function loginWithOAuth(
  provider: OAuthProvider,
  data: OAuthLoginRequestDto,
): Promise<OAuthResultDto> {
  return apiRequest<OAuthResultDto>(`/auth/oauth/${provider}`, {
    method: 'POST',
    body: data,
  })
}

export function completeOAuthRegistration(
  data: CompleteOAuthRegistrationRequestDto,
): Promise<AuthResponseDto> {
  return apiRequest<AuthResponseDto>('/auth/oauth/complete-registration', {
    method: 'POST',
    body: data,
  })
}
