using GorilaType.Api.Models.Entities;

namespace GorilaType.Api.Repositories.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
    Task CreateAsync(Guid userId, string tokenHash, DateTime expiresAt);
    Task RevokeAsync(Guid userId, Guid refreshTokenId);
}
