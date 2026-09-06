using System.Security.Cryptography;
using GorilaType.Api.Models.Dto.Auth;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using GorilaType.Api.Services.Interfaces;

namespace GorilaType.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IPasswordResetCodeRepository _passwordResetCodeRepository;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    private const int RefreshTokenExpirationDays = 7;
    private const int PasswordResetCodeExpirationMinutes = 15;
    private const int PasswordResetMaxAttempts = 5;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordResetCodeRepository passwordResetCodeRepository,
        ITokenService tokenService,
        IEmailService emailService,
        ILogger<AuthService> logger
    )
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordResetCodeRepository = passwordResetCodeRepository;
        _tokenService = tokenService;
        _emailService = emailService;
        _logger = logger;
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

    public async Task<string> ForgotPasswordAsync(
        ForgotPasswordRequestDto request
    )
    {
        var code = GenerateSixDigitCode();
        var codeHash = _tokenService.HashToken(code);

        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user is not null && user.DeletedAt is null)
        {
            await _passwordResetCodeRepository.InvalidateActiveByUserIdAsync(
                user.Id
            );

            await _passwordResetCodeRepository.CreateAsync(
                user.Id,
                codeHash,
                DateTime.UtcNow.AddMinutes(PasswordResetCodeExpirationMinutes)
            );

            try
            {
                await _emailService.SendPasswordResetCodeAsync(
                    user.Email,
                    user.Username,
                    code
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Fallo al enviar el correo de recuperación de contraseña para el usuario {UserId}",
                    user.Id
                );
            }
        }

        return request.Email;
    }

    private static string GenerateSixDigitCode()
    {
        return RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
    }

    public async Task ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user is null || user.DeletedAt is not null)
        {
            throw new UnauthorizedAccessException(
                "Código inválido o expirado."
            );
        }

        var resetCode =
            await _passwordResetCodeRepository.GetActiveByUserIdAsync(user.Id);

        if (resetCode is null)
        {
            throw new UnauthorizedAccessException(
                "Código inválido o expirado."
            );
        }

        if (resetCode.Attempts >= PasswordResetMaxAttempts)
        {
            await _passwordResetCodeRepository.MarkAsUsedAsync(
                user.Id,
                resetCode.Id
            );
            throw new UnauthorizedAccessException(
                "Se superó el número máximo de intentos. Solicita un nuevo código."
            );
        }

        var codeHash = _tokenService.HashToken(request.Code);

        if (codeHash != resetCode.CodeHash)
        {
            await _passwordResetCodeRepository.IncrementAttemptsAsync(
                user.Id,
                resetCode.Id
            );
            throw new UnauthorizedAccessException(
                "Código inválido o expirado."
            );
        }

        var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(
            request.NewPassword
        );
        await _userRepository.UpdatePasswordAsync(user.Id, newPasswordHash);

        await _passwordResetCodeRepository.MarkAsUsedAsync(
            user.Id,
            resetCode.Id
        );
    }
}
