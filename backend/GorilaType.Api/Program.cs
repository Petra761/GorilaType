// Punto de entrada de la API: configuración de servicios y del pipeline HTTP

var builder = WebApplication.CreateBuilder(args);

// Nombre de la política de CORS, para poder referenciarla al usarla más abajo
const string FrontendCorsPolicy = "FrontendCorsPolicy";

// Configuración de CORS: por ahora solo se permite el origen del frontend en desarrollo (Vite)
// TODO: cuando exista un dominio de producción, agregarlo aquí o mover el origen a appsettings
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        FrontendCorsPolicy,
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173") // puerto por defecto de Vite en desarrollo
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

// Registro de controllers (necesario para que la API detecte las clases [ApiController])
builder.Services.AddControllers();

// Swagger/OpenAPI: documentación automática de los endpoints, solo se expone en desarrollo
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware de Swagger: solo activo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirige automáticamente las peticiones HTTP a HTTPS
app.UseHttpsRedirection();

// Aplica la política de CORS definida arriba; debe ir antes de la autorización
app.UseCors(FrontendCorsPolicy);

// Middleware de autorización (por ahora sin autenticación configurada, se agrega más adelante junto con JWT)
app.UseAuthorization();

// Mapea las rutas de los controllers ([ApiController], [Route], etc.)
app.MapControllers();

app.Run();
