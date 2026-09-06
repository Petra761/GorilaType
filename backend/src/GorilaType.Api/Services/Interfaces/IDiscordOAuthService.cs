namespace GorilaType.Api.Services.Interfaces;

public record DiscordUserInfo(
    string Id,
    string Email,
    string Name,
    string? AvatarUrl
);

public interface IDiscordOAuthService
{
    Task<DiscordUserInfo> GetUserInfoAsync(string code);
}
