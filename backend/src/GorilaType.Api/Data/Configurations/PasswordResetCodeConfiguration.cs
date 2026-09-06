using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class PasswordResetCodeConfiguration
    : IEntityTypeConfiguration<PasswordResetCode>
{
    public void Configure(EntityTypeBuilder<PasswordResetCode> builder)
    {
        builder.ToTable("password_reset_codes");

        builder.HasKey(prc => prc.Id);

        builder.Property(prc => prc.Id).HasColumnName("id");

        builder
            .Property(prc => prc.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder
            .Property(prc => prc.CodeHash)
            .HasColumnName("code_hash")
            .IsRequired();

        builder
            .Property(prc => prc.ExpiresAt)
            .HasColumnName("expires_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder
            .Property(prc => prc.Attempts)
            .HasColumnName("attempts")
            .HasDefaultValue(0)
            .IsRequired();

        builder
            .Property(prc => prc.UsedAt)
            .HasColumnName("used_at")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder
            .Property(prc => prc.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.HasIndex(prc => prc.UserId);

        builder
            .HasOne(prc => prc.User)
            .WithMany()
            .HasForeignKey(prc => prc.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
