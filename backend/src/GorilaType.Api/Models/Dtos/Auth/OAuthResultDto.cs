namespace GorilaType.Api.Models.Dto.Auth;

public class OAuthResultDto
{
    public bool UsernameRequired { get; set; }
    public string? PendingToken { get; set; }
    public List<string>? SuggestedUsernames { get; set; }
    public AuthResponseDto? Auth { get; set; }
}
