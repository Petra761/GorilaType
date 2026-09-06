using GorilaType.Api.Data;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GorilaType.Api.Repositories;

public class OAuthAccountRepository : IOAuthAccountRepository
{
    private readonly AppDbContext _context;

    public OAuthAccountRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<OAuthAccount?> GetByProviderAsync(
        string provider,
        string providerUserId
    )
    {
        return await _context.OAuthAccounts.FirstOrDefaultAsync(oa =>
            oa.Provider == provider && oa.ProviderUserId == providerUserId
        );
    }

    public async Task CreateAsync(
        Guid userId,
        string provider,
        string providerUserId
    )
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var oauthAccount = new OAuthAccount
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Provider = provider,
            ProviderUserId = providerUserId,
            CreatedAt = DateTime.UtcNow,
        };

        await _context.OAuthAccounts.AddAsync(oauthAccount);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();
    }
}
