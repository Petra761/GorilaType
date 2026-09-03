namespace GorilaType.Api.Models.Entities;

public class LeaderboardGlobal
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int Duration { get; set; }
    public string Language { get; set; } = null!;
    public int BestWpm { get; set; }
    public double Accuracy { get; set; }
    public int RawWpm { get; set; }
    public double Consistency { get; set; }
    public DateTime AchievedAt { get; set; }

    public User User { get; set; } = null!;
}
