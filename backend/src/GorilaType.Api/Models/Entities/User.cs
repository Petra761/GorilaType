namespace GorilaType.Api.Models.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PasswordHash { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<OAuthAccount> OAuthAccounts { get; set; } =
        new List<OAuthAccount>();
    public ICollection<Test> Tests { get; set; } = new List<Test>();
    public ICollection<LeaderboardGlobal> LeaderboardGlobalRecords { get; set; } =
        new List<LeaderboardGlobal>();
    public ICollection<LeaderboardDaily> LeaderboardDailyRecords { get; set; } =
        new List<LeaderboardDaily>();
    public ICollection<Friendship> SentFriendRequests { get; set; } =
        new List<Friendship>();
    public ICollection<Friendship> ReceivedFriendRequests { get; set; } =
        new List<Friendship>();
}
