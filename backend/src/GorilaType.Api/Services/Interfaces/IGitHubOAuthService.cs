namespace GorilaType.Api.Services.Interfaces;

public record GitHubUserInfo(
    string Id,
    string Email,
    string Name,
    string? AvatarUrl
);

public interface IGitHubOAuthService
{
    Task<GitHubUserInfo> GetUserInfoAsync(string code);
}
