using GorilaType.Api.Models.Entities;

namespace GorilaType.Api.Repositories.Interfaces;

public interface IPasswordResetCodeRepository
{
    Task<PasswordResetCode?> GetActiveByUserIdAndCodeHashAsync(
        Guid userId,
        string codeHash
    );
    Task CreateAsync(Guid userId, string codeHash, DateTime expiresAt);
    Task IncrementAttemptsAsync(Guid userId, Guid codeId);
    Task MarkAsUsedAsync(Guid userId, Guid codeId);
    Task InvalidateActiveByUserIdAsync(Guid userId);
    Task<PasswordResetCode?> GetActiveByUserIdAsync(Guid userId);
}
