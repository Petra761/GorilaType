using System.Security.Claims;
using GorilaType.Api.Models.Entities;

namespace GorilaType.Api.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string HashToken(string token);
    string GeneratePendingRegistrationToken(
        string provider,
        string providerUserId,
        string email,
        string? pictureUrl
    );
    ClaimsPrincipal? ValidatePendingRegistrationToken(string token);
}
