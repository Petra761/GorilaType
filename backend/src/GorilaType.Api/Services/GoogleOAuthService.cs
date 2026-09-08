using System.Net.Http.Json;
using System.Text.Json.Serialization;
using GorilaType.Api.Models.Options;
using GorilaType.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace GorilaType.Api.Services;

public class GoogleOAuthService : IGoogleOAuthService
{
    private readonly HttpClient _httpClient;
    private readonly GoogleOAuthOptions _options;

    public GoogleOAuthService(
        HttpClient httpClient,
        IOptions<GoogleOAuthOptions> options
    )
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<GoogleUserInfo> GetUserInfoAsync(string code)
    {
        var tokenResponse = await _httpClient.PostAsync(
            "https://oauth2.googleapis.com/token",
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
                "No se pudo validar la autenticación con Google."
            );
        }

        var tokenData =
            await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>();

        if (tokenData is null)
        {
            throw new UnauthorizedAccessException(
                "No se pudo validar la autenticación con Google."
            );
        }

        var userInfoResponse = await _httpClient.GetAsync(
            $"https://www.googleapis.com/oauth2/v2/userinfo?access_token={tokenData.AccessToken}"
        );

        if (!userInfoResponse.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException(
                "No se pudo obtener el perfil de Google."
            );
        }

        var userInfo =
            await userInfoResponse.Content.ReadFromJsonAsync<GoogleUserInfoResponse>();

        if (userInfo is null)
        {
            throw new UnauthorizedAccessException(
                "No se pudo obtener el perfil de Google."
            );
        }

        return new GoogleUserInfo(
            userInfo.Id,
            userInfo.Email,
            userInfo.Name,
            userInfo.Picture
        );
    }

    private class GoogleTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = null!;
    }

    private class GoogleUserInfoResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = null!;

        [JsonPropertyName("email")]
        public string Email { get; set; } = null!;

        [JsonPropertyName("name")]
        public string Name { get; set; } = null!;

        [JsonPropertyName("picture")]
        public string? Picture { get; set; }
    }
}
