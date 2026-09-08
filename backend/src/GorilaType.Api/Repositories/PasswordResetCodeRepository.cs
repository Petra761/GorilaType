using GorilaType.Api.Data;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GorilaType.Api.Repositories;

public class PasswordResetCodeRepository : IPasswordResetCodeRepository
{
    private readonly AppDbContext _context;

    public PasswordResetCodeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PasswordResetCode?> GetActiveByUserIdAndCodeHashAsync(
        Guid userId,
        string codeHash
    )
    {
        return await _context
            .PasswordResetCodes.Where(prc =>
                prc.UserId == userId
                && prc.CodeHash == codeHash
                && prc.UsedAt == null
                && prc.ExpiresAt > DateTime.UtcNow
            )
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(
        Guid userId,
        string codeHash,
        DateTime expiresAt
    )
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var resetCode = new PasswordResetCode
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CodeHash = codeHash,
            ExpiresAt = expiresAt,
            Attempts = 0,
            CreatedAt = DateTime.UtcNow,
        };

        await _context.PasswordResetCodes.AddAsync(resetCode);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();
    }

    public async Task IncrementAttemptsAsync(Guid userId, Guid codeId)
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var resetCode = await _context.PasswordResetCodes.FirstOrDefaultAsync(
            prc => prc.Id == codeId
        );

        if (resetCode is not null)
        {
            resetCode.Attempts += 1;
            await _context.SaveChangesAsync();
        }

        await transaction.CommitAsync();
    }

    public async Task MarkAsUsedAsync(Guid userId, Guid codeId)
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var resetCode = await _context.PasswordResetCodes.FirstOrDefaultAsync(
            prc => prc.Id == codeId
        );

        if (resetCode is not null)
        {
            resetCode.UsedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        await transaction.CommitAsync();
    }

    public async Task InvalidateActiveByUserIdAsync(Guid userId)
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var activeCodes = await _context
            .PasswordResetCodes.Where(prc =>
                prc.UserId == userId && prc.UsedAt == null
            )
            .ToListAsync();

        foreach (var code in activeCodes)
        {
            code.UsedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    public async Task<PasswordResetCode?> GetActiveByUserIdAsync(Guid userId)
    {
        return await _context
            .PasswordResetCodes.Where(prc =>
                prc.UserId == userId
                && prc.UsedAt == null
                && prc.ExpiresAt > DateTime.UtcNow
            )
            .OrderByDescending(prc => prc.CreatedAt)
            .FirstOrDefaultAsync();
    }
}
