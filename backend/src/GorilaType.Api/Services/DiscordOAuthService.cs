using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using GorilaType.Api.Models.Options;
using GorilaType.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace GorilaType.Api.Services;

public class DiscordOAuthService : IDiscordOAuthService
{
    private readonly HttpClient _httpClient;
    private readonly DiscordOAuthOptions _options;

    public DiscordOAuthService(
        HttpClient httpClient,
        IOptions<DiscordOAuthOptions> options
    )
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<DiscordUserInfo> GetUserInfoAsync(string code)
    {
        var tokenResponse = await _httpClient.PostAsync(
            "https://discord.com/api/oauth2/token",
            new FormUrlEncodedContent(
                new Dictionary<string, string>
                {
                    ["code"] = code,
                    ["client_id"] = _options.ClientId,
                    ["client_secret"] = _options.ClientSecret,
                    ["redirect_uri"] = _options.RedirectUri,
                    ["grant_type"] = "authorization_code",
                }
            )
        );

        if (!tokenResponse.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException(
                "No se pudo validar la autenticación con Discord."
            );
        }

        var tokenData =
            await tokenResponse.Content.ReadFromJsonAsync<DiscordTokenResponse>();

        if (tokenData?.AccessToken is null)
        {
            throw new UnauthorizedAccessException(
                "No se pudo validar la autenticación con Discord."
            );
        }

        var userRequest = new HttpRequestMessage(
            HttpMethod.Get,
            "https://discord.com/api/users/@me"
        );
        userRequest.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            tokenData.AccessToken
        );

        var userResponse = await _httpClient.SendAsync(userRequest);

        if (!userResponse.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException(
                "No se pudo obtener el perfil de Discord."
            );
        }

        var userInfo =
            await userResponse.Content.ReadFromJsonAsync<DiscordUserResponse>();

        if (userInfo is null || string.IsNullOrEmpty(userInfo.Email))
        {
            throw new UnauthorizedAccessException(
                "Tu cuenta de Discord no tiene un correo verificado disponible."
            );
        }

        string? avatarUrl = null;
        if (!string.IsNullOrEmpty(userInfo.Avatar))
        {
            avatarUrl =
                $"https://cdn.discordapp.com/avatars/{userInfo.Id}/{userInfo.Avatar}.png";
        }

        var displayName = userInfo.GlobalName ?? userInfo.Username;

        return new DiscordUserInfo(
            userInfo.Id,
            userInfo.Email,
            displayName,
            avatarUrl
        );
    }

    private class DiscordTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }
    }

    private class DiscordUserResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = null!;

        [JsonPropertyName("username")]
        public string Username { get; set; } = null!;

        [JsonPropertyName("global_name")]
        public string? GlobalName { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("verified")]
        public bool Verified { get; set; }

        [JsonPropertyName("avatar")]
        public string? Avatar { get; set; }
    }
}
