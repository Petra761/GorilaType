namespace GorilaType.Api.Services.Interfaces;

public interface IEmailService
{
    Task SendPasswordResetCodeAsync(
        string toEmail,
        string username,
        string code
    );
}
