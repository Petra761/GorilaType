using GorilaType.Api.Models.Dto.Auth;
using GorilaType.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GorilaType.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    private const string RefreshTokenCookieName = "refreshToken";

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
            var (response, refreshToken) = await _authService.RegisterAsync(
                request
            );
            SetRefreshTokenCookie(refreshToken);
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
            var (response, refreshToken) = await _authService.LoginAsync(
                request
            );
            SetRefreshTokenCookie(refreshToken);
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

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh()
    {
        var refreshToken = Request.Cookies[RefreshTokenCookieName];

        if (string.IsNullOrEmpty(refreshToken))
        {
            return Problem(
                detail: "No se encontró una sesión activa.",
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Autenticación fallida."
            );
        }

        try
        {
            var (response, newRefreshToken) = await _authService.RefreshAsync(
                refreshToken
            );
            SetRefreshTokenCookie(newRefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            Response.Cookies.Delete(
                RefreshTokenCookieName,
                new CookieOptions { Path = "/api/auth" }
            );
            return Problem(
                detail: ex.Message,
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Autenticación fallida."
            );
        }
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        Response.Cookies.Append(
            RefreshTokenCookieName,
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7),
                Path = "/api/auth",
            }
        );
    }
}
