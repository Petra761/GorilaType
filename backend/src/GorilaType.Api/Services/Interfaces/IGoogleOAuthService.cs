namespace GorilaType.Api.Services.Interfaces;

public record GoogleUserInfo(
    string Id,
    string Email,
    string Name,
    string? Picture
);

public interface IGoogleOAuthService
{
    Task<GoogleUserInfo> GetUserInfoAsync(string code);
}
