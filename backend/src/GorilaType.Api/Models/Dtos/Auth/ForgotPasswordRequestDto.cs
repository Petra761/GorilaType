using System.ComponentModel.DataAnnotations;

namespace GorilaType.Api.Models.Dto.Auth;

public class ForgotPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}
