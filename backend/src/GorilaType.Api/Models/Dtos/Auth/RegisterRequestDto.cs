using System.ComponentModel.DataAnnotations;

namespace GorilaType.Api.Models.Dto.Auth;

public class RegisterRequestDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = null!;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(
        8,
        ErrorMessage = "La contraseña debe tener al menos 8 caracteres."
    )]
    public string Password { get; set; } = null!;
}
