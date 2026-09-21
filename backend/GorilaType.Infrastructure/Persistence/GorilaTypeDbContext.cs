// Contexto principal de EF Core; las entidades se van agregando acá a medida que se implementa cada módulo
using Microsoft.EntityFrameworkCore;

namespace GorilaType.Infrastructure.Persistence;

public class GorilaTypeDbContext : DbContext
{
    public GorilaTypeDbContext(DbContextOptions<GorilaTypeDbContext> options)
        : base(options) { }

    // Los DbSet<T> de cada entidad se agregan acá cuando se implemente el módulo correspondiente
}