namespace GorilaType.Api.Models.Options;

public class GitHubOAuthOptions
{
    public const string SectionName = "GitHubOAuth";

    public string ClientId { get; set; } = null!;
    public string ClientSecret { get; set; } = null!;
    public string RedirectUri { get; set; } = null!;
}
