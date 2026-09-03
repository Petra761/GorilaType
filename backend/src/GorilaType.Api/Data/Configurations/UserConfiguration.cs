using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id).HasColumnName("id");

        builder
            .Property(u => u.Username)
            .HasColumnName("username")
            .HasMaxLength(50)
            .IsRequired();

        builder
            .Property(u => u.Email)
            .HasColumnName("email")
            .HasMaxLength(100)
            .IsRequired();

        builder
            .Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .IsRequired(false);

        builder
            .Property(u => u.ProfilePictureUrl)
            .HasColumnName("profile_picture_url")
            .IsRequired(false);

        builder
            .Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder
            .Property(u => u.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder
            .Property(u => u.LastLogin)
            .HasColumnName("last_login")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder
            .Property(u => u.DeletedAt)
            .HasColumnName("deleted_at")
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder.HasIndex(u => u.Username).IsUnique();

        builder.HasIndex(u => u.Email).IsUnique();
    }
}
