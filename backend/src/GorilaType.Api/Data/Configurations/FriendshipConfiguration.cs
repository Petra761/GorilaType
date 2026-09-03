using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class FriendshipConfiguration : IEntityTypeConfiguration<Friendship>
{
    public void Configure(EntityTypeBuilder<Friendship> builder)
    {
        builder.ToTable("friendships");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.Id).HasColumnName("id");

        builder
            .Property(f => f.RequesterId)
            .HasColumnName("requester_id")
            .IsRequired();

        builder
            .Property(f => f.AddresseeId)
            .HasColumnName("addressee_id")
            .IsRequired();

        builder
            .Property(f => f.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .IsRequired();

        builder
            .Property(f => f.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder
            .Property(f => f.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.HasIndex(f => new { f.RequesterId, f.AddresseeId }).IsUnique();

        builder
            .HasOne(f => f.Requester)
            .WithMany(u => u.SentFriendRequests)
            .HasForeignKey(f => f.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(f => f.Addressee)
            .WithMany(u => u.ReceivedFriendRequests)
            .HasForeignKey(f => f.AddresseeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
