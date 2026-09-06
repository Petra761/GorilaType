using GorilaType.Api.Models.Dto.Auth;

namespace GorilaType.Api.Services.Interfaces;

public interface IAuthService
{
    Task<(AuthResponseDto response, string refreshToken)> RegisterAsync(
        RegisterRequestDto request
    );
    Task<(AuthResponseDto response, string refreshToken)> LoginAsync(
        LoginRequestDto request
    );
    Task<(AuthResponseDto response, string refreshToken)> RefreshAsync(
        string refreshToken
    );
    Task LogoutAsync(string refreshToken);
    Task<string> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task ResetPasswordAsync(ResetPasswordRequestDto request);
    Task<(OAuthResultDto result, string? refreshToken)> LoginWithGoogleAsync(
        string code
    );
    Task<(
        AuthResponseDto response,
        string refreshToken
    )> CompleteOAuthRegistrationAsync(
        CompleteOAuthRegistrationRequestDto request
    );
    Task<(OAuthResultDto result, string? refreshToken)> LoginWithGitHubAsync(
        string code
    );
    Task<(OAuthResultDto result, string? refreshToken)> LoginWithDiscordAsync(
        string code
    );
}
