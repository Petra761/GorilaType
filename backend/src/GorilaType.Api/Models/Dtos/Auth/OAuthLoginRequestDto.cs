using System.ComponentModel.DataAnnotations;

namespace GorilaType.Api.Models.Dto.Auth;

public class OAuthLoginRequestDto
{
    [Required]
    public string Code { get; set; } = null!;
}
