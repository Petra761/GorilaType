using GorilaType.Api.Models.Dto.Auth;
using GorilaType.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GorilaType.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(
        RegisterRequestDto request
    )
    {
        try
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Problem(
                detail: ex.Message,
                statusCode: StatusCodes.Status409Conflict,
                title: "No se pudo completar el registro."
            );
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(
        LoginRequestDto request
    )
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Problem(
                detail: ex.Message,
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Autenticación fallida."
            );
        }
    }
}
