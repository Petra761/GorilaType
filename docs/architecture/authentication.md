# Autenticación

> Cómo funciona la autenticación en GorilaType: JWT, sesiones persistentes, cierre de sesión, recuperación de contraseña y login con proveedores externos (OAuth).

**Última actualización:** 2026-09-05
**Autor(es):** Petra761

---

## Índice

- [Autenticación](#autenticación)
  - [Índice](#índice)
  - [1. Visión general](#1-visión-general)
  - [2. Registro y login tradicional](#2-registro-y-login-tradicional)
  - [3. Access token (JWT)](#3-access-token-jwt)
  - [4. Persistencia de sesión (refresh tokens)](#4-persistencia-de-sesión-refresh-tokens)
  - [5. Cierre de sesión](#5-cierre-de-sesión)
  - [6. Recuperación de contraseña](#6-recuperación-de-contraseña)
  - [7. Autenticación con OAuth](#7-autenticación-con-oauth)
    - [7.1 Por qué no se usa el middleware de autenticación por cookies de ASP.NET Core](#71-por-qué-no-se-usa-el-middleware-de-autenticación-por-cookies-de-aspnet-core)
    - [7.2 Vinculación de cuentas](#72-vinculación-de-cuentas)
    - [7.3 Flujo de dos pasos para elección de username](#73-flujo-de-dos-pasos-para-elección-de-username)
    - [7.4 Particularidades por proveedor](#74-particularidades-por-proveedor)
    - [7.5 Imagen de perfil (GT-01.5)](#75-imagen-de-perfil-gt-015)
    - [7.6 Credenciales de las OAuth Apps](#76-credenciales-de-las-oauth-apps)
  - [8. Endpoints disponibles](#8-endpoints-disponibles)
  - [9. Variables de entorno relacionadas](#9-variables-de-entorno-relacionadas)

---

## 1. Visión general

GorilaType usa un esquema de autenticación **sin estado** (stateless) basado en JWT, con las siguientes piezas:

- Un **access token** (JWT) de corta duración, que el frontend adjunta en cada request protegido.
- Un **refresh token** de larga duración, persistido en base de datos y entregado al cliente únicamente vía **cookie httpOnly**, nunca en el cuerpo de la respuesta.
- Soporte para **login tradicional** (correo + contraseña) y **login con OAuth** (Google, GitHub, Discord), ambos convergiendo en el mismo mecanismo de emisión de tokens.

Toda la lógica vive en `AuthService` (`Services/AuthService.cs`), expuesta a través de `AuthController` (`Controllers/AuthController.cs`), bajo la ruta base `/api/auth`.

> [!NOTE]
> Los flujos que requieren que un usuario actualice su propia fila antes de tener un JWT emitido (por ejemplo, `LastLogin` en el login, o crear su propio `RefreshToken`) usan `AppDbContext.BeginUserScopedTransactionAsync(userId)` para setear `app.current_user_id` explícitamente, ya que las políticas RLS de la base de datos lo exigen. Ver sección 5.3 de [`backend-architecture.md`](./backend-architecture.md) para el detalle de RLS.

---

## 2. Registro y login tradicional

**Registro** (`POST /api/auth/register`): valida el `RegisterRequestDto` (username, email, password) vía `DataAnnotations`, verifica que el correo y el username no existan (los índices únicos de `users` son la última línea de defensa, pero se valida antes también a nivel de aplicación), hashea la contraseña con **BCrypt** (con salt automático, sin pepper — ver decisión en el historial del proyecto), y genera un avatar automático con DiceBear (ver sección 7.5, aplica igual aquí).

**Login** (`POST /api/auth/login`): busca el usuario por email, verifica con `BCrypt.Verify`, y si es válido, emite tokens. El mensaje de error es siempre genérico (`"Credenciales inválidas."`) sin importar si el problema fue el email, la contraseña, o una cuenta con soft-delete (`DeletedAt != null`) — esto evita enumeración de usuarios.

Un detalle de seguridad relevante: el chequeo de login incluye `user.PasswordHash is null` como causa de fallo — esto cubre el caso de un usuario que se registró únicamente vía OAuth y no tiene contraseña local, evitando que `BCrypt.Verify` lance una excepción no controlada.

---

## 3. Access token (JWT)

Generado por `TokenService.GenerateAccessToken`, firmado con **HMAC-SHA256** usando un secreto de 64 bytes (`Jwt__Secret`, nunca committeado). Incluye los claims estándar `sub` (user id), `email`, `name` (username) y un `jti` único por token (para una eventual lista de revocación futura, no implementada aún).

Duración: **15 minutos** (`Jwt__ExpirationMinutes`). Es intencionalmente corto porque la persistencia real de la sesión la sostiene el refresh token, no el access token — así se limita la ventana de exposición si un access token es robado.

---

## 4. Persistencia de sesión (refresh tokens)

Implementa GT-01.1. Tabla `refresh_tokens` (ver [`database-schema.md`](./database-schema.md), v3).

- **Generación:** 64 bytes aleatorios criptográficamente seguros (`RandomNumberGenerator`), codificados en Base64. Se persiste únicamente su **hash SHA-256** (`TokenService.HashToken`) — nunca el valor crudo. A diferencia de las contraseñas, no se usa BCrypt aquí: el token no es un valor elegido por un humano sino aleatorio de alta entropía, así que la lentitud deliberada de BCrypt no aporta seguridad real y sí un costo de rendimiento innecesario.
- **Entrega al cliente:** cookie `refreshToken`, `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/api/auth`, expiración de 7 días. Nunca viaja en el cuerpo de la respuesta JSON.
- **Rotación:** cada llamada a `POST /api/auth/refresh` revoca el token usado y emite uno nuevo. Si un token robado se reutiliza después de haber sido rotado, la segunda llamada falla — señal de posible compromiso (hoy no hay una reacción automática ante esto, es una mejora futura).
- **Multi-sesión:** al ser una tabla separada (no una columna en `users`), un usuario puede tener múltiples refresh tokens activos simultáneamente (ej. celular + laptop).

> [!IMPORTANT]
> El endpoint `/api/auth/refresh` **no depende de Scalar** para probarse correctamente — Scalar puede enrutar las pruebas "Try it" a través de un proxy propio que rompe el comportamiento de cookies `SameSite`. Para probar flujos con cookies, usar **Thunder Client** o `curl`/`curl.exe` con manejo de cookie jar.

---

## 5. Cierre de sesión

Implementa GT-01.4. `POST /api/auth/logout` revoca el refresh token asociado a la cookie recibida (marca `RevokedAt`) y borra la cookie del cliente. Es **idempotente**: llamar a logout con un token ya revocado o inexistente no lanza error, simplemente no hace nada — cerrar sesión dos veces no debería ser una condición de error.

---

## 6. Recuperación de contraseña

Implementa GT-01.3. Tabla `password_reset_codes` (ver `database-schema.md`, v4).

- **Código:** numérico de 6 dígitos (`RandomNumberGenerator.GetInt32`), no un enlace. Se persiste su hash SHA-256.
- **Por qué el hash solo no basta aquí:** a diferencia del refresh token (512 bits de entropía), un código de 6 dígitos tiene solo 10⁶ combinaciones — insuficiente para resistir fuerza bruta solo con hashing. Se complementa con:
  - `expires_at`: 15 minutos.
  - `attempts`: máximo 5 intentos fallidos antes de invalidar el código.
  - `used_at`: un solo uso.
- **Flujo:** `POST /api/auth/forgot-password` genera el código, invalida cualquier código activo previo del usuario (`InvalidateActiveByUserIdAsync`), lo guarda, y lo envía por correo. Responde **siempre el mismo mensaje genérico**, exista o no el correo en el sistema — el trabajo computacional (generar código, hashear) se ejecuta igual en ambos casos para no filtrar por diferencia de tiempo de respuesta cuál rama se tomó.
- **Verificación:** `POST /api/auth/reset-password` busca el código activo **solo por `user_id`** (no por hash en el filtro SQL) y compara el hash en memoria — esto es necesario para poder incrementar el contador de intentos en un código real cuando el valor ingresado no coincide. Buscar directamente por `(user_id, hash)` haría imposible aplicar el límite de intentos, porque un hash incorrecto nunca encontraría la fila a incrementar.
- **Envío de correo:** vía SMTP (Gmail, cuenta dedicada `gorilatype.noreply@gmail.com`), usando `MailKit`. Se eligió SMTP sobre un proveedor transaccional (Resend) porque estos últimos exigen verificar un dominio propio para enviar a destinatarios arbitrarios, y el proyecto aún no tiene dominio de producción. Ver decisión completa en el historial del proyecto. Limitación conocida: mayor probabilidad de caer en spam que un proveedor transaccional con dominio verificado; aceptable para la etapa actual del proyecto.
- **Resiliencia:** un fallo al enviar el correo (`EmailService.SendPasswordResetCodeAsync`) se captura y registra vía `ILogger`, sin propagarse como error al usuario — se mantiene el mismo mensaje genérico de éxito. El código ya quedó guardado en base de todos modos.

> [!NOTE]
> Pendiente (frontend): diseñar una plantilla HTML con buen diseño visual para el correo de recuperación — hoy es HTML simple sin estilos, suficiente para desarrollo pero no para producción.

---

## 7. Autenticación con OAuth

Implementa GT-01.2. Proveedores soportados: **Google**, **GitHub**, **Discord**. Los tres siguen exactamente el mismo flujo genérico; solo cambia el servicio que habla con la API de cada proveedor (`IGoogleOAuthService`, `IGitHubOAuthService`, `IDiscordOAuthService`).

### 7.1 Por qué no se usa el middleware de autenticación por cookies de ASP.NET Core

ASP.NET Core trae soporte nativo para OAuth (`AddGoogle()`, etc.), pero está diseñado para aplicaciones server-rendered con sesión de navegador. Como el frontend es una SPA (Vite + React) desacoplada del backend, se optó por un flujo API-first:

1. El **frontend** redirige al usuario directamente a la pantalla de consentimiento del proveedor.
2. El proveedor redirige de vuelta al frontend (no al backend) con un `code` de autorización.
3. El **frontend** envía ese `code` a un endpoint del backend.
4. El **backend** intercambia el `code` por un token con el proveedor (llamada servidor-a-servidor), obtiene el perfil, y emite sus propios tokens (mismo access token + refresh token que el login tradicional).

### 7.2 Vinculación de cuentas

Al recibir el perfil del proveedor (`provider_user_id`, `email`, `name`, foto), la lógica (`AuthService.LoginWithOAuthProviderAsync`, privado, compartido por los 3 proveedores) sigue este orden:

1. **¿Existe un `OAuthAccount` con ese `(provider, provider_user_id)`?** → Login recurrente, se emite tokens para el usuario vinculado.
2. **¿Existe un `User` con ese email, registrado por otra vía?** → Se vincula automáticamente el nuevo `OAuthAccount` a ese usuario existente. Se asume seguro porque el proveedor OAuth ya verificó la propiedad del correo.
3. **Ninguno de los anteriores** → Se crea un `User` nuevo (sin `PasswordHash`) y su `OAuthAccount`.

### 7.3 Flujo de dos pasos para elección de username

Cuando se crea un usuario nuevo (caso 3), el nombre del proveedor se sanea a un username candidato (`AuthService.SanitizeUsername`: quita diacríticos, espacios y caracteres no alfanuméricos, minúsculas, máx. 50 caracteres). Si ese candidato **ya está en uso**, no se crea el usuario de inmediato — se le da al usuario la oportunidad real de elegir su propio nombre, en vez de asignarle automáticamente un sufijo numérico:

1. El backend responde con `usernameRequired: true`, un **`pendingToken`** (JWT de 10 minutos, firmado con el mismo secreto de `Jwt__Secret`, con los datos del proveedor como claims: `provider`, `provider_user_id`, `email`, `picture`, y un claim `purpose = pending_oauth_registration` que evita que un access token normal se reutilice indebidamente aquí), y hasta 3 `suggestedUsernames` (candidato + sufijo numérico) como atajo opcional.
2. El frontend muestra esas sugerencias más un campo libre.
3. El frontend llama a `POST /api/auth/oauth/complete-registration` con `{ pendingToken, username }`.
4. El backend valida el `pendingToken`, confirma que el username elegido sigue disponible, y recién ahí crea el `User` + `OAuthAccount`.

Si el candidato **no** colisiona (la mayoría de los casos), el flujo se resuelve en un solo paso, igual que un login normal — el segundo paso solo aparece cuando realmente hace falta.

### 7.4 Particularidades por proveedor

| Proveedor | Endpoint de token                     | Endpoint de perfil                  | Notas                                                                                                                                                                                                                                          |
| --------- | ------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google    | `oauth2.googleapis.com/token`         | `googleapis.com/oauth2/v2/userinfo` | El más simple de los tres.                                                                                                                                                                                                                     |
| GitHub    | `github.com/login/oauth/access_token` | `api.github.com/user`               | Requiere header `Accept: application/json` en el intercambio de token (si no, GitHub responde en `x-www-form-urlencoded`). El email puede venir oculto en `/user`; si es así, se consulta `GET /user/emails` y se toma el primario verificado. |
| Discord   | `discord.com/api/oauth2/token`        | `discord.com/api/users/@me`         | El avatar viene como hash (`avatar`), no como URL — se construye manualmente: `cdn.discordapp.com/avatars/{id}/{avatar}.png`.                                                                                                                  |

> [!NOTE]
> Mejora pendiente (baja prioridad): `DiscordOAuthService` no exige explícitamente que el campo `verified` del email sea `true` — confía en que el scope `email` ya lo garantiza en la práctica.

### 7.5 Imagen de perfil (GT-01.5)

- **Registro tradicional:** avatar generado automáticamente con [DiceBear](https://www.dicebear.com/) (estilo `identicon`), usando el `user.Id` (no el username) como semilla — así el avatar nunca cambia aunque el username se edite en el futuro. URL: `https://api.dicebear.com/10.x/identicon/svg?seed={userId}`.
- **Registro/login vía OAuth:** se usa la foto de perfil que provee el proveedor (`picture`/`avatar_url`). Si el proveedor no la entrega, se cae al mismo fallback de DiceBear.

### 7.6 Credenciales de las OAuth Apps

Cada proveedor requiere una aplicación OAuth registrada externamente (Client ID + Client Secret), bajo la cuenta personal de GitHub/Google Cloud/Discord del autor del proyecto (ver decisión y razonamiento en el historial del proyecto — se evaluaron Organizations/Teams y se optó por cuenta personal dado el tamaño actual del equipo). Las `Redirect URI` apuntan hoy a `http://localhost:5173/...` (puerto de desarrollo de Vite) y deberán actualizarse cuando exista una URL de producción.

---

## 8. Endpoints disponibles

Todos bajo la ruta base `/api/auth`.

| Método | Ruta                           | Body                                  | Descripción                                                          |
| ------ | ------------------------------ | ------------------------------------- | -------------------------------------------------------------------- |
| POST   | `/register`                    | `RegisterRequestDto`                  | Registro tradicional.                                                |
| POST   | `/login`                       | `LoginRequestDto`                     | Login tradicional.                                                   |
| POST   | `/refresh`                     | — (cookie)                            | Rota el refresh token, emite nuevo access token.                     |
| POST   | `/logout`                      | — (cookie)                            | Revoca el refresh token activo.                                      |
| POST   | `/forgot-password`             | `ForgotPasswordRequestDto`            | Envía código de recuperación por correo.                             |
| POST   | `/reset-password`              | `ResetPasswordRequestDto`             | Verifica código y cambia la contraseña.                              |
| POST   | `/oauth/google`                | `OAuthLoginRequestDto` (`code`)       | Login/registro con Google.                                           |
| POST   | `/oauth/github`                | `OAuthLoginRequestDto` (`code`)       | Login/registro con GitHub.                                           |
| POST   | `/oauth/discord`               | `OAuthLoginRequestDto` (`code`)       | Login/registro con Discord.                                          |
| POST   | `/oauth/complete-registration` | `CompleteOAuthRegistrationRequestDto` | Segundo paso del flujo OAuth cuando el username candidato colisiona. |

> [!IMPORTANT]
> **Pendiente de verificación funcional end-to-end:** los tres endpoints de OAuth (`/oauth/google`, `/oauth/github`, `/oauth/discord`) están implementados y compilan, pero no han sido probados con un `code` real, ya que eso requiere un frontend capaz de completar el flujo de consentimiento del proveedor en el navegador. Verificar en la sesión de implementación del frontend.

---

## 9. Variables de entorno relacionadas

Ver `.env.example` para la lista completa y actualizada. Resumen por área:

- **JWT:** `Jwt__Issuer`, `Jwt__Audience`, `Jwt__Secret`, `Jwt__ExpirationMinutes`.
- **SMTP (recuperación de contraseña):** `Smtp__Host`, `Smtp__Port`, `Smtp__Username`, `Smtp__Password`, `Smtp__FromEmail`, `Smtp__FromName`.
- **OAuth:** `GoogleOAuth__*`, `GitHubOAuth__*`, `DiscordOAuth__*` (cada uno con `ClientId`, `ClientSecret`, `RedirectUri`).
