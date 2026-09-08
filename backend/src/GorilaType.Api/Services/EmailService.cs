using GorilaType.Api.Models.Options;
using GorilaType.Api.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace GorilaType.Api.Services;

public class EmailService : IEmailService
{
    private readonly SmtpOptions _smtpOptions;

    public EmailService(IOptions<SmtpOptions> smtpOptions)
    {
        _smtpOptions = smtpOptions.Value;
    }

    public async Task SendPasswordResetCodeAsync(
        string toEmail,
        string username,
        string code
    )
    {
        var message = new MimeMessage();

        message.From.Add(
            new MailboxAddress(_smtpOptions.FromName, _smtpOptions.FromEmail)
        );
        message.To.Add(new MailboxAddress(username, toEmail));
        message.Subject = "Recupera tu contraseña en GorilaType";

        message.Body = new TextPart("html")
        {
            Text =
                $@"
                <p>Hola {username},</p>
                <p>Usa el siguiente código para restablecer tu contraseña. Expira en 15 minutos:</p>
                <h2>{code}</h2>
                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                ",
        };

        using var client = new SmtpClient();

        await client.ConnectAsync(
            _smtpOptions.Host,
            _smtpOptions.Port,
            SecureSocketOptions.StartTls
        );

        await client.AuthenticateAsync(
            _smtpOptions.Username,
            _smtpOptions.Password
        );

        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
