using GorilaType.Api.Models.Entities;

namespace GorilaType.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByIdAsync(Guid id);
    Task AddAsync(User user);
    Task SaveChangesAsync();
    Task UpdateLastLoginAsync(Guid userId);
}
