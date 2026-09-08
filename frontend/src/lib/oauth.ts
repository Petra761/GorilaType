import type { OAuthProvider } from '@/types/auth'

interface OAuthProviderConfig {
  authorizationUrl: string
  clientId: string
  scope: string
  extraParams?: Record<string, string>
}

function getRedirectUri(provider: OAuthProvider): string {
  return `${window.location.origin}/auth/callback/${provider}`
}

function getProviderConfig(provider: OAuthProvider): OAuthProviderConfig {
  switch (provider) {
    case 'google':
      return {
        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
      }
    case 'github':
      return {
        authorizationUrl: 'https://github.com/login/oauth/authorize',
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
        scope: 'read:user user:email',
      }
    case 'discord':
      return {
        authorizationUrl: 'https://discord.com/api/oauth2/authorize',
        clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
        scope: 'identify email',
      }
  }
}

export function buildOAuthAuthorizationUrl(provider: OAuthProvider): string {
  const config = getProviderConfig(provider)
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getRedirectUri(provider),
    response_type: 'code',
    scope: config.scope,
    ...config.extraParams,
  })

  return `${config.authorizationUrl}?${params.toString()}`
}

export function redirectToOAuthProvider(provider: OAuthProvider): void {
  window.location.href = buildOAuthAuthorizationUrl(provider)
}
