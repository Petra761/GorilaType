using System.ComponentModel.DataAnnotations;

namespace GorilaType.Api.Models.Dto.Auth;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}
