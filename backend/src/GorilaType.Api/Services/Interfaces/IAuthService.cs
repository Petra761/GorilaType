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
}
