using GorilaType.Api.Models.Dto.Auth;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using GorilaType.Api.Services.Interfaces;

namespace GorilaType.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly ITokenService _tokenService;

    private const int RefreshTokenExpirationDays = 7;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        ITokenService tokenService
    )
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _tokenService = tokenService;
    }

    public async Task<(
        AuthResponseDto response,
        string refreshToken
    )> RegisterAsync(RegisterRequestDto request)
    {
        var existingByEmail = await _userRepository.GetByEmailAsync(
            request.Email
        );
        if (existingByEmail is not null)
        {
            throw new InvalidOperationException(
                "El correo ya está registrado."
            );
        }

        var existingByUsername = await _userRepository.GetByUsernameAsync(
            request.Username
        );
        if (existingByUsername is not null)
        {
            throw new InvalidOperationException(
                "El nombre de usuario ya está en uso."
            );
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        user.ProfilePictureUrl =
            $"https://api.dicebear.com/10.x/identicon/svg?seed={user.Id}";

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return await IssueTokensAsync(user);
    }

    public async Task<(
        AuthResponseDto response,
        string refreshToken
    )> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (
            user is null
            || user.DeletedAt is not null
            || user.PasswordHash is null
            || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)
        )
        {
            throw new UnauthorizedAccessException("Credenciales inválidas.");
        }

        await _userRepository.UpdateLastLoginAsync(user.Id);

        return await IssueTokensAsync(user);
    }

    private async Task<(
        AuthResponseDto response,
        string refreshToken
    )> IssueTokensAsync(User user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenHash = _tokenService.HashToken(refreshToken);

        await _refreshTokenRepository.CreateAsync(
            user.Id,
            refreshTokenHash,
            DateTime.UtcNow.AddDays(RefreshTokenExpirationDays)
        );

        var response = new AuthResponseDto
        {
            AccessToken = accessToken,
            UserId = user.Id,
            Username = user.Username,
            ProfilePictureUrl = user.ProfilePictureUrl,
        };

        return (response, refreshToken);
    }

    public async Task<(
        AuthResponseDto response,
        string refreshToken
    )> RefreshAsync(string refreshToken)
    {
        var tokenHash = _tokenService.HashToken(refreshToken);
        var storedToken = await _refreshTokenRepository.GetByTokenHashAsync(
            tokenHash
        );

        if (
            storedToken is null
            || storedToken.RevokedAt is not null
            || storedToken.ExpiresAt < DateTime.UtcNow
        )
        {
            throw new UnauthorizedAccessException(
                "Sesión inválida o expirada."
            );
        }

        var user = await _userRepository.GetByIdAsync(storedToken.UserId);

        if (user is null || user.DeletedAt is not null)
        {
            throw new UnauthorizedAccessException(
                "Sesión inválida o expirada."
            );
        }

        await _refreshTokenRepository.RevokeAsync(user.Id, storedToken.Id);

        return await IssueTokensAsync(user);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var tokenHash = _tokenService.HashToken(refreshToken);
        var storedToken = await _refreshTokenRepository.GetByTokenHashAsync(
            tokenHash
        );

        if (storedToken is not null && storedToken.RevokedAt is null)
        {
            await _refreshTokenRepository.RevokeAsync(
                storedToken.UserId,
                storedToken.Id
            );
        }
    }
}
