using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

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
}
