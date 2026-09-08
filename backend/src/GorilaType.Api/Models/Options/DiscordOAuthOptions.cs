namespace GorilaType.Api.Models.Options;

public class DiscordOAuthOptions
{
    public const string SectionName = "DiscordOAuth";

    public string ClientId { get; set; } = null!;
    public string ClientSecret { get; set; } = null!;
    public string RedirectUri { get; set; } = null!;
}
