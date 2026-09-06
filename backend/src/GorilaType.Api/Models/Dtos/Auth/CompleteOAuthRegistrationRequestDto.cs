using System.ComponentModel.DataAnnotations;

namespace GorilaType.Api.Models.Dto.Auth;

public class CompleteOAuthRegistrationRequestDto
{
    [Required]
    public string PendingToken { get; set; } = null!;

    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = null!;
}
