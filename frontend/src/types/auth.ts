export interface AuthResponseDto {
  accessToken: string
  userId: string
  username: string
  profilePictureUrl: string | null
}

export interface RegisterRequestDto {
  username: string
  email: string
  password: string
}

export interface LoginRequestDto {
  email: string
  password: string
}

export interface ForgotPasswordRequestDto {
  email: string
}

export interface ResetPasswordRequestDto {
  email: string
  code: string
  newPassword: string
}

export interface OAuthLoginRequestDto {
  code: string
}

export interface CompleteOAuthRegistrationRequestDto {
  pendingToken: string
  username: string
}

export interface OAuthResultDto {
  usernameRequired: boolean
  pendingToken?: string
  suggestedUsernames?: string[]
  auth?: AuthResponseDto
}

export type OAuthProvider = 'google' | 'github' | 'discord'

export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  traceId?: string
}
