using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class LeaderboardDailyConfiguration
    : IEntityTypeConfiguration<LeaderboardDaily>
{
    public void Configure(EntityTypeBuilder<LeaderboardDaily> builder)
    {
        builder.ToTable("leaderboard_daily");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Id).HasColumnName("id");

        builder.Property(l => l.UserId).HasColumnName("user_id").IsRequired();

        builder
            .Property(l => l.Language)
            .HasColumnName("language")
            .HasMaxLength(10)
            .IsRequired();

        builder
            .Property(l => l.Duration)
            .HasColumnName("duration")
            .IsRequired();

        builder.Property(l => l.Wpm).HasColumnName("wpm").IsRequired();

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
            .Property(l => l.TestDate)
            .HasColumnName("test_date")
            .HasColumnType("date")
            .IsRequired();

        builder
            .HasIndex(l => new
            {
                l.UserId,
                l.Duration,
                l.Language,
                l.TestDate,
            })
            .IsUnique();

        builder
            .HasOne(l => l.User)
            .WithMany(u => u.LeaderboardDailyRecords)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
