using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using GorilaType.Api.Models.Options;
using GorilaType.Api.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace GorilaType.Api.Services;

public class GitHubOAuthService : IGitHubOAuthService
{
    private readonly HttpClient _httpClient;
    private readonly GitHubOAuthOptions _options;

    public GitHubOAuthService(
        HttpClient httpClient,
        IOptions<GitHubOAuthOptions> options
    )
    {
        _httpClient = httpClient;
        _options = options.Value;
        _httpClient.DefaultRequestHeaders.UserAgent.Add(
            new ProductInfoHeaderValue("GorilaType", "1.0")
        );
    }

    public async Task<GitHubUserInfo> GetUserInfoAsync(string code)
    {
        var tokenRequest = new HttpRequestMessage(
            HttpMethod.Post,
            "https://github.com/login/oauth/access_token"
        )
        {
            Content = new FormUrlEncodedContent(
                new Dictionary<string, string>
                {
                    ["code"] = code,
                    ["client_id"] = _options.ClientId,
                    ["client_secret"] = _options.ClientSecret,
                    ["redirect_uri"] = _options.RedirectUri,
                }
            ),
        };
        tokenRequest.Headers.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );

        var tokenResponse = await _httpClient.SendAsync(tokenRequest);

        if (!tokenResponse.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException(
                "No se pudo validar la autenticación con GitHub."
            );
        }

        var tokenData =
            await tokenResponse.Content.ReadFromJsonAsync<GitHubTokenResponse>();

        if (tokenData?.AccessToken is null)
        {
            throw new UnauthorizedAccessException(
                "No se pudo validar la autenticación con GitHub."
            );
        }

        var userRequest = new HttpRequestMessage(
            HttpMethod.Get,
            "https://api.github.com/user"
        );
        userRequest.Headers.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            tokenData.AccessToken
        );

        var userResponse = await _httpClient.SendAsync(userRequest);

        if (!userResponse.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException(
                "No se pudo obtener el perfil de GitHub."
            );
        }

        var userInfo =
            await userResponse.Content.ReadFromJsonAsync<GitHubUserResponse>();

        if (userInfo is null)
        {
            throw new UnauthorizedAccessException(
                "No se pudo obtener el perfil de GitHub."
            );
        }

        var email = userInfo.Email;

        if (string.IsNullOrEmpty(email))
        {
            var emailsRequest = new HttpRequestMessage(
                HttpMethod.Get,
                "https://api.github.com/user/emails"
            );
            emailsRequest.Headers.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                tokenData.AccessToken
            );

            var emailsResponse = await _httpClient.SendAsync(emailsRequest);

            if (emailsResponse.IsSuccessStatusCode)
            {
                var emails = await emailsResponse.Content.ReadFromJsonAsync<
                    List<GitHubEmailResponse>
                >();

                email = emails
                    ?.FirstOrDefault(e => e.Primary && e.Verified)
                    ?.Email;
            }
        }

        if (string.IsNullOrEmpty(email))
        {
            throw new UnauthorizedAccessException(
                "Tu cuenta de GitHub no tiene un correo verificado disponible."
            );
        }

        return new GitHubUserInfo(
            userInfo.Id.ToString(),
            email,
            userInfo.Name ?? userInfo.Login,
            userInfo.AvatarUrl
        );
    }

    private class GitHubTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string? AccessToken { get; set; }
    }

    private class GitHubUserResponse
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("login")]
        public string Login { get; set; } = null!;

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("avatar_url")]
        public string? AvatarUrl { get; set; }
    }

    private class GitHubEmailResponse
    {
        [JsonPropertyName("email")]
        public string Email { get; set; } = null!;

        [JsonPropertyName("primary")]
        public bool Primary { get; set; }

        [JsonPropertyName("verified")]
        public bool Verified { get; set; }
    }
}
