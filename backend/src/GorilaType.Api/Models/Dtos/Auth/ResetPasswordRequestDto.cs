using System.ComponentModel.DataAnnotations;

namespace GorilaType.Api.Models.Dto.Auth;

public class ResetPasswordRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = null!;

    [Required]
    [MinLength(
        8,
        ErrorMessage = "La contraseña debe tener al menos 8 caracteres."
    )]
    public string NewPassword { get; set; } = null!;
}
