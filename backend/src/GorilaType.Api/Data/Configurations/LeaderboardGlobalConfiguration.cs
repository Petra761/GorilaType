using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class LeaderboardGlobalConfiguration
    : IEntityTypeConfiguration<LeaderboardGlobal>
{
    public void Configure(EntityTypeBuilder<LeaderboardGlobal> builder)
    {
        builder.ToTable("leaderboard_global");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Id).HasColumnName("id");

        builder.Property(l => l.UserId).HasColumnName("user_id").IsRequired();

        builder
            .Property(l => l.Duration)
            .HasColumnName("duration")
            .IsRequired();

        builder
            .Property(l => l.Language)
            .HasColumnName("language")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(l => l.BestWpm).HasColumnName("best_wpm").IsRequired();

        builder
            .Property(l => l.Accuracy)
            .HasColumnName("accuracy")
            .IsRequired();

        builder.Property(l => l.RawWpm).HasColumnName("raw_wpm").IsRequired();

        builder
            .Property(l => l.Consistency)
            .HasColumnName("consistency")
            .IsRequired();

        builder
            .Property(l => l.AchievedAt)
            .HasColumnName("achieved_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder
            .HasIndex(l => new
            {
                l.UserId,
                l.Duration,
                l.Language,
            })
            .IsUnique();

        builder
            .HasOne(l => l.User)
            .WithMany(u => u.LeaderboardGlobalRecords)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
