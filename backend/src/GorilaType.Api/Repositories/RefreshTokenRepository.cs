using GorilaType.Api.Data;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GorilaType.Api.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
    {
        return await _context.RefreshTokens.FirstOrDefaultAsync(rt =>
            rt.TokenHash == tokenHash
        );
    }

    public async Task CreateAsync(
        Guid userId,
        string tokenHash,
        DateTime expiresAt
    )
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow,
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();
    }

    public async Task RevokeAsync(Guid userId, Guid refreshTokenId)
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(
            rt => rt.Id == refreshTokenId
        );

        if (refreshToken is not null)
        {
            refreshToken.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        await transaction.CommitAsync();
    }
}
