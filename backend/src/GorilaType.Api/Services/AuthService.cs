using GorilaType.Api.Models.Dto.Auth;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using GorilaType.Api.Services.Interfaces;

namespace GorilaType.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public AuthService(
        IUserRepository userRepository,
        ITokenService tokenService
    )
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
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

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            UserId = user.Id,
            Username = user.Username,
            ProfilePictureUrl = user.ProfilePictureUrl,
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
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

        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            UserId = user.Id,
            Username = user.Username,
            ProfilePictureUrl = user.ProfilePictureUrl,
        };
    }
}
