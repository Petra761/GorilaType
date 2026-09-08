using DotNetEnv;
using GorilaType.Api.Data;
using GorilaType.Api.Models.Options;
using GorilaType.Api.Repositories;
using GorilaType.Api.Repositories.Interfaces;
using GorilaType.Api.Services;
using GorilaType.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

// Carga las variables de entorno
Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// Servicios principales
// ─────────────────────────────────────────────

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ─────────────────────────────────────────────
// Base de datos
// ─────────────────────────────────────────────

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ─────────────────────────────────────────────
// Repositorios
// ─────────────────────────────────────────────

builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<
    IPasswordResetCodeRepository,
    PasswordResetCodeRepository
>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOAuthAccountRepository, OAuthAccountRepository>();

// ─────────────────────────────────────────────
// Servicios de aplicación
// ─────────────────────────────────────────────

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// ─────────────────────────────────────────────
// Servicios OAuth
// ─────────────────────────────────────────────

builder.Services.AddHttpClient<IGoogleOAuthService, GoogleOAuthService>();
builder.Services.AddHttpClient<IGitHubOAuthService, GitHubOAuthService>();
builder.Services.AddHttpClient<IDiscordOAuthService, DiscordOAuthService>();

// ─────────────────────────────────────────────
// Configuración de opciones
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────

var frontendOrigin =
    builder.Configuration["Frontend:Origin"] ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy
                .WithOrigins(frontendOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

var app = builder.Build();

// ─────────────────────────────────────────────
// Documentación de API
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthorization();

// ─────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────

app.MapControllers();

app.Run();
