using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GorilaType.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<OAuthAccount> OAuthAccounts => Set<OAuthAccount>();
    public DbSet<Test> Tests => Set<Test>();
    public DbSet<LeaderboardGlobal> LeaderboardGlobal =>
        Set<LeaderboardGlobal>();
    public DbSet<LeaderboardDaily> LeaderboardDaily => Set<LeaderboardDaily>();
    public DbSet<Friendship> Friendships => Set<Friendship>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly
        );
        base.OnModelCreating(modelBuilder);
    }

    // TODO: reemplazar el parámetro userId por el user_id extraído del JWT
    // una vez que el middleware de autenticación real esté implementado.
    public async Task<IDbContextTransaction> BeginUserScopedTransactionAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var transaction = await Database.BeginTransactionAsync(
            cancellationToken
        );

        await Database.ExecuteSqlInterpolatedAsync(
            $"SELECT set_config('app.current_user_id', {userId.ToString()}, true)",
            cancellationToken
        );

        return transaction;
    }
}
