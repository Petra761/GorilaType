using GorilaType.Api.Data;
using GorilaType.Api.Models.Entities;
using GorilaType.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GorilaType.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u =>
            u.Username == username
        );
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task UpdateLastLoginAsync(Guid userId)
    {
        await using var transaction =
            await _context.BeginUserScopedTransactionAsync(userId);

        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Id == userId
        );
        if (user is not null)
        {
            user.LastLogin = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        await transaction.CommitAsync();
    }
}
