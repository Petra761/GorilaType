namespace GorilaType.Api.Models.Entities;

public class Test
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string TestType { get; set; } = null!;
    public int Duration { get; set; }
    public string Language { get; set; } = null!;
    public int Wpm { get; set; }
    public double Accuracy { get; set; }
    public int RawWpm { get; set; }
    public double Consistency { get; set; }
    public int CorrectChars { get; set; }
    public int IncorrectChars { get; set; }
    public int ExtraChars { get; set; }
    public int MissedChars { get; set; }
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
