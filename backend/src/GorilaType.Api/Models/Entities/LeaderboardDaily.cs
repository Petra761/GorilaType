namespace GorilaType.Api.Models.Entities;

public class LeaderboardDaily
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Language { get; set; } = null!;
    public int Duration { get; set; }
    public int Wpm { get; set; }
    public double Accuracy { get; set; }
    public int RawWpm { get; set; }
    public double Consistency { get; set; }
    public DateOnly TestDate { get; set; }

    public User User { get; set; } = null!;
}
