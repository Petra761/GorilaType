using GorilaType.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GorilaType.Api.Data.Configurations;

public class TestConfiguration : IEntityTypeConfiguration<Test>
{
    public void Configure(EntityTypeBuilder<Test> builder)
    {
        builder.ToTable("tests");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasColumnName("id");

        builder.Property(t => t.UserId).HasColumnName("user_id").IsRequired();

        builder
            .Property(t => t.TestType)
            .HasColumnName("test_type")
            .HasMaxLength(20)
            .IsRequired();

        builder
            .Property(t => t.Duration)
            .HasColumnName("duration")
            .IsRequired();

        builder
            .Property(t => t.Language)
            .HasColumnName("language")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(t => t.Wpm).HasColumnName("wpm").IsRequired();

        builder
            .Property(t => t.Accuracy)
            .HasColumnName("accuracy")
            .IsRequired();

        builder.Property(t => t.RawWpm).HasColumnName("raw_wpm").IsRequired();

        builder
            .Property(t => t.Consistency)
            .HasColumnName("consistency")
            .IsRequired();

        builder
            .Property(t => t.CorrectChars)
            .HasColumnName("correct_chars")
            .IsRequired();

        builder
            .Property(t => t.IncorrectChars)
            .HasColumnName("incorrect_chars")
            .IsRequired();

        builder
            .Property(t => t.ExtraChars)
            .HasColumnName("extra_chars")
            .IsRequired();

        builder
            .Property(t => t.MissedChars)
            .HasColumnName("missed_chars")
            .IsRequired();

        builder
            .Property(t => t.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.HasIndex(t => t.UserId);
        builder.HasIndex(t => t.TestType);

        builder
            .HasOne(t => t.User)
            .WithMany(u => u.Tests)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
