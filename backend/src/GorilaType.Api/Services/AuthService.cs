using System.Security.Cryptography;
using System.Text;
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
    private readonly IOAuthAccountRepository _oauthAccountRepository;
    private readonly IGoogleOAuthService _googleOAuthService;
    private readonly IGitHubOAuthService _gitHubOAuthService;
    private readonly IDiscordOAuthService _discordOAuthService;

    private const int RefreshTokenExpirationDays = 7;
    private const int PasswordResetCodeExpirationMinutes = 15;
    private const int PasswordResetMaxAttempts = 5;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordResetCodeRepository passwordResetCodeRepository,
        ITokenService tokenService,
        IEmailService emailService,
        ILogger<AuthService> logger,
        IOAuthAccountRepository oauthAccountRepository,
        IGoogleOAuthService googleOAuthService,
        IGitHubOAuthService gitHubOAuthService,
        IDiscordOAuthService discordOAuthService
    )
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordResetCodeRepository = passwordResetCodeRepository;
        _tokenService = tokenService;
        _emailService = emailService;
        _logger = logger;
        _oauthAccountRepository = oauthAccountRepository;
        _googleOAuthService = googleOAuthService;
        _gitHubOAuthService = gitHubOAuthService;
        _discordOAuthService = discordOAuthService;
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

    public async Task<(
        OAuthResultDto result,
        string? refreshToken
    )> LoginWithGoogleAsync(string code)
    {
        var googleUser = await _googleOAuthService.GetUserInfoAsync(code);
        return await LoginWithOAuthProviderAsync(
            "google",
            googleUser.Id,
            googleUser.Email,
            googleUser.Name,
            googleUser.Picture
        );
    }

    public async Task<(
        OAuthResultDto result,
        string? refreshToken
    )> LoginWithGitHubAsync(string code)
    {
        var gitHubUser = await _gitHubOAuthService.GetUserInfoAsync(code);
        return await LoginWithOAuthProviderAsync(
            "github",
            gitHubUser.Id,
            gitHubUser.Email,
            gitHubUser.Name,
            gitHubUser.AvatarUrl
        );
    }

    public async Task<(
        OAuthResultDto result,
        string? refreshToken
    )> LoginWithDiscordAsync(string code)
    {
        var discordUser = await _discordOAuthService.GetUserInfoAsync(code);
        return await LoginWithOAuthProviderAsync(
            "discord",
            discordUser.Id,
            discordUser.Email,
            discordUser.Name,
            discordUser.AvatarUrl
        );
    }

    private async Task<(
        OAuthResultDto result,
        string? refreshToken
    )> LoginWithOAuthProviderAsync(
        string provider,
        string providerUserId,
        string email,
        string name,
        string? pictureUrl
    )
    {
        var existingOAuthAccount =
            await _oauthAccountRepository.GetByProviderAsync(
                provider,
                providerUserId
            );

        if (existingOAuthAccount is not null)
        {
            var linkedUser = await _userRepository.GetByIdAsync(
                existingOAuthAccount.UserId
            );

            if (linkedUser is null || linkedUser.DeletedAt is not null)
            {
                throw new UnauthorizedAccessException("Cuenta no disponible.");
            }

            await _userRepository.UpdateLastLoginAsync(linkedUser.Id);
            var (response, refreshToken) = await IssueTokensAsync(linkedUser);

            return (
                new OAuthResultDto
                {
                    UsernameRequired = false,
                    Auth = response,
                },
                refreshToken
            );
        }

        var existingByEmail = await _userRepository.GetByEmailAsync(email);

        if (existingByEmail is not null)
        {
            if (existingByEmail.DeletedAt is not null)
            {
                throw new UnauthorizedAccessException("Cuenta no disponible.");
            }

            await _oauthAccountRepository.CreateAsync(
                existingByEmail.Id,
                provider,
                providerUserId
            );
            await _userRepository.UpdateLastLoginAsync(existingByEmail.Id);
            var (response, refreshToken) = await IssueTokensAsync(
                existingByEmail
            );

            return (
                new OAuthResultDto
                {
                    UsernameRequired = false,
                    Auth = response,
                },
                refreshToken
            );
        }

        var candidateUsername = SanitizeUsername(name);
        var usernameTaken = await _userRepository.GetByUsernameAsync(
            candidateUsername
        );

        if (usernameTaken is null)
        {
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Username = candidateUsername,
                Email = email,
                PasswordHash = null,
                ProfilePictureUrl =
                    pictureUrl
                    ?? $"https://api.dicebear.com/10.x/identicon/svg?seed={Guid.NewGuid()}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _userRepository.AddAsync(newUser);
            await _userRepository.SaveChangesAsync();
            await _oauthAccountRepository.CreateAsync(
                newUser.Id,
                provider,
                providerUserId
            );
            await _userRepository.UpdateLastLoginAsync(newUser.Id);

            var (response, refreshToken) = await IssueTokensAsync(newUser);

            return (
                new OAuthResultDto
                {
                    UsernameRequired = false,
                    Auth = response,
                },
                refreshToken
            );
        }

        var pendingToken = _tokenService.GeneratePendingRegistrationToken(
            provider,
            providerUserId,
            email,
            pictureUrl
        );
        var suggestions = await GenerateUsernameSuggestionsAsync(
            candidateUsername
        );

        return (
            new OAuthResultDto
            {
                UsernameRequired = true,
                PendingToken = pendingToken,
                SuggestedUsernames = suggestions,
            },
            null
        );
    }

    public async Task<(
        AuthResponseDto response,
        string refreshToken
    )> CompleteOAuthRegistrationAsync(
        CompleteOAuthRegistrationRequestDto request
    )
    {
        var principal = _tokenService.ValidatePendingRegistrationToken(
            request.PendingToken
        );

        if (principal is null)
        {
            throw new UnauthorizedAccessException(
                "El proceso de registro expiró o es inválido. Intenta de nuevo."
            );
        }

        var provider = principal.FindFirst("provider")!.Value;
        var providerUserId = principal.FindFirst("provider_user_id")!.Value;
        var email = principal.FindFirst("email")!.Value;
        var picture = principal.FindFirst("picture")?.Value;

        var existingUsername = await _userRepository.GetByUsernameAsync(
            request.Username
        );
        if (existingUsername is not null)
        {
            throw new InvalidOperationException(
                "El nombre de usuario ya está en uso."
            );
        }

        var existingOAuthAccount =
            await _oauthAccountRepository.GetByProviderAsync(
                provider,
                providerUserId
            );
        if (existingOAuthAccount is not null)
        {
            throw new InvalidOperationException(
                "Esta cuenta ya fue registrada."
            );
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = email,
            PasswordHash = null,
            ProfilePictureUrl =
                picture
                ?? $"https://api.dicebear.com/10.x/identicon/svg?seed={Guid.NewGuid()}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        await _oauthAccountRepository.CreateAsync(
            user.Id,
            provider,
            providerUserId
        );
        await _userRepository.UpdateLastLoginAsync(user.Id);

        return await IssueTokensAsync(user);
    }

    private static string SanitizeUsername(string name)
    {
        var normalized = name.Normalize(NormalizationForm.FormD)
            .Where(c =>
                System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c)
                != System.Globalization.UnicodeCategory.NonSpacingMark
            )
            .ToArray();

        var withoutDiacritics = new string(normalized).Normalize(
            NormalizationForm.FormC
        );

        var sanitized = new string(
            withoutDiacritics
                .ToLowerInvariant()
                .Where(c => char.IsLetterOrDigit(c))
                .ToArray()
        );

        if (sanitized.Length > 50)
        {
            sanitized = sanitized[..50];
        }

        if (sanitized.Length < 3)
        {
            sanitized = sanitized.PadRight(3, '0');
        }

        return sanitized;
    }

    private async Task<List<string>> GenerateUsernameSuggestionsAsync(
        string baseUsername
    )
    {
        var suggestions = new List<string>();

        for (var i = 2; i <= 4 && suggestions.Count < 3; i++)
        {
            var candidate = $"{baseUsername}{i}";
            var exists = await _userRepository.GetByUsernameAsync(candidate);
            if (exists is null)
            {
                suggestions.Add(candidate);
            }
        }

        return suggestions;
    }
}
