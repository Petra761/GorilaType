using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class OAuthAccountConfiguration : IEntityTypeConfiguration<OAuthAccount>
{
    public void Configure(EntityTypeBuilder<OAuthAccount> builder)
    {
        builder.ToTable("oauth_accounts");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Id).HasColumnName("id");

        builder.Property(o => o.UserId).HasColumnName("user_id").IsRequired();

        builder
            .Property(o => o.Provider)
            .HasColumnName("provider")
            .HasMaxLength(50)
            .IsRequired();

        builder
            .Property(o => o.ProviderUserId)
            .HasColumnName("provider_user_id")
            .HasMaxLength(100)
            .IsRequired();

        builder
            .Property(o => o.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.HasIndex(o => new { o.Provider, o.ProviderUserId }).IsUnique();

        builder
            .HasOne(o => o.User)
            .WithMany(u => u.OAuthAccounts)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
