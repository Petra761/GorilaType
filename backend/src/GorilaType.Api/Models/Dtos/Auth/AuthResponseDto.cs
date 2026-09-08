namespace GorilaType.Api.Models.Dto.Auth;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = null!;
    public Guid UserId { get; set; }
    public string Username { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
}
