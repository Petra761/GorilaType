using Microsoft.EntityFrameworkCore;

namespace GorilaType.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
}
