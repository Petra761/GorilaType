using GorilaType.Api.Models.Entities;

namespace GorilaType.Api.Repositories.Interfaces;

public interface IOAuthAccountRepository
{
    Task<OAuthAccount?> GetByProviderAsync(
        string provider,
        string providerUserId
    );
    Task CreateAsync(Guid userId, string provider, string providerUserId);
}
