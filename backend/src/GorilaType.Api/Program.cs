using DotNetEnv;
using GorilaType.Api.Data;
using GorilaType.Api.Models.Options;
using GorilaType.Api.Repositories;
using GorilaType.Api.Repositories.Interfaces;
using GorilaType.Api.Services;
using GorilaType.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<
    IPasswordResetCodeRepository,
    PasswordResetCodeRepository
>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOAuthAccountRepository, OAuthAccountRepository>();

builder.Services.AddHttpClient<IGoogleOAuthService, GoogleOAuthService>();
builder.Services.AddHttpClient<IGitHubOAuthService, GitHubOAuthService>();
builder.Services.AddHttpClient<IDiscordOAuthService, DiscordOAuthService>();

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName)
);
builder.Services.Configure<SmtpOptions>(
    builder.Configuration.GetSection(SmtpOptions.SectionName)
);
builder.Services.Configure<GoogleOAuthOptions>(
    builder.Configuration.GetSection(GoogleOAuthOptions.SectionName)
);
builder.Services.Configure<GitHubOAuthOptions>(
    builder.Configuration.GetSection(GitHubOAuthOptions.SectionName)
);
builder.Services.Configure<DiscordOAuthOptions>(
    builder.Configuration.GetSection(DiscordOAuthOptions.SectionName)
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "GorilaType API";
    });
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "GorilaType API v1");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
