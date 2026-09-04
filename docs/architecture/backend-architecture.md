# Arquitectura del backend

> Cómo está organizado el backend de GorilaType y cómo fluye una request de punta a punta.

**Última actualización:** 2026-09-04
**Autor(es):** Petra761

---

## 1. Un solo proyecto, capas por carpeta

No usamos Clean Architecture con proyectos separados — es un único proyecto Web API (`GorilaType.Api`), con la separación de responsabilidades hecha por carpeta:

Controller → Service → Repository → AppDbContext (Data/)

- **`Controllers/`** recibe el HTTP request, valida lo mínimo (shape del request) y delega en un `Service`. No conoce EF Core ni el `AppDbContext`.
- **`Services/`** contiene la lógica de negocio. No arma queries de EF Core directo — pasa por un `Repository`.
- **`Repositories/`** es la única capa que le habla a `AppDbContext` y a la base de datos.
- **`Data/`** tiene el `AppDbContext` y su configuración.

Cada capa depende de la **interfaz** de la capa de abajo (`IPlayerService`, `IPlayerRepository`), nunca de la implementación concreta — eso es lo que permite testear un `Service` sin una base de datos real, inyectando un `Repository` falso.

```
Models/
├── Entities/ → clases que mapean tablas (usadas por Repositories y Data)
└── Dtos/ → lo que entra/sale por la API (usado por Controllers y Services)
```

Una `Entity` nunca se devuelve directo desde un `Controller` — siempre se mapea a un `Dto`.

---

## 2. Documentación de la API: Scalar + Swagger

`Microsoft.AspNetCore.OpenApi` genera un único documento OpenAPI (`/openapi/v1.json`), y dos interfaces lo consumen:

- **`/scalar`** — la que se usa día a día en desarrollo.
- **`/swagger`** — queda como respaldo clásico, por si alguien tiene problemas con Scalar.

No hay dos generadores de documentación conviviendo — ambas UIs leen el mismo JSON, así que nunca pueden desincronizarse entre sí.

---

## 3. Configuración y secretos

- `appsettings.json` define la **forma** de la configuración (qué claves existen), pero nunca valores reales.
- Los valores reales viven en un `.env` en la raíz del repo (fuera de git), cargado con el paquete `DotNetEnv` al arrancar la app (`Env.TraversePath().Load()` en `Program.cs`).
- Las claves anidadas usan `__` (doble guion bajo) en el `.env` para mapear a la jerarquía de `appsettings.json`: `ConnectionStrings__DefaultConnection` → `ConnectionStrings:DefaultConnection`.
- `appsettings.Example.json` y `.env.example` documentan qué claves espera la app, sin valores reales — es la referencia para cualquiera que clone el repo.

Detalle completo de por qué se eligió `.env` en vez de `dotnet user-secrets` → ver historial de decisiones del equipo (o preguntar, si no quedó registrado en otro lado).

---

## 4. Autenticación (JWT)

En progreso — trackeado en un Issue aparte. La infraestructura de JWT (middleware, generación y validación de tokens) se documenta acá una vez que esté mergeada a `develop`. El login real depende de que exista la tabla `Users` (a definir junto con el diagrama de base de datos).

---

## 5. Base de datos y persistencia

PostgreSQL alojado en [Supabase](https://supabase.com/), con acceso mediante Entity Framework Core y el proveedor `Npgsql.EntityFrameworkCore.PostgreSQL`. El diagrama y normalización de entidades se encuentran detallados en [`database-diagram.md`](./database-diagram.md).

### 5.1 Conexión vía Session Pooler (IPv4)

Para la conectividad con Supabase se utiliza el **Session Pooler** (`aws-0-us-east-1.pooler.supabase.com:5432`) en lugar de la conexión directa (`db.<project-ref>.supabase.co:5432`).

- **Limitación de IPv6 en desarrollo local:** La conexión directa de Supabase resuelve únicamente sobre direcciones IPv6. En la mayoría de los entornos de desarrollo locales y proveedores de internet residenciales, el enrutamiento o resolución IPv6 no está habilitado, provocando fallos de conexión inmediatos (`Network is unreachable` / timeout). El Session Pooler proporciona un endpoint accesible vía **IPv4**.
- **Modo Session Pooler:** Se utiliza el puerto `5432` (Session Mode) en lugar del puerto de Transaction Pooler (`6543`). Esto es indispensable porque la aplicación ejecuta comandos con estado a nivel de sesión y transacción como `set_config` para Row Level Security y requiere transacciones completas gestionadas por EF Core.

### 5.2 Roles de PostgreSQL y segregación de privilegios

Se implementa el principio de mínimo privilegio en el motor de base de datos a través de dos roles diferenciados:

| Rol              | Tipo                                     | Atributo BYPASSRLS    | Ámbito de uso                                                             |
| ---------------- | ---------------------------------------- | --------------------- | ------------------------------------------------------------------------- |
| `postgres`       | Superusuario / Owner de la base de datos | **Sí** (`BYPASSRLS`)  | Exclusivo para migraciones y operaciones DDL (`CREATE`, `ALTER`, `DROP`). |
| `gorilatype_app` | Rol de aplicación de mínimo privilegio   | **No** (sujeto a RLS) | Runtime de la Web API. Solo realiza operaciones CRUD (`DML`).             |

El rol `gorilatype_app` no posee permisos de superusuario ni `BYPASSRLS`. Sus privilegios sobre el esquema `public` están limitados estrictamente a operaciones de manipulación de datos (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) en tablas existentes y futuras:

```sql
-- Configuración de privilegios de runtime para gorilatype_app
GRANT USAGE ON SCHEMA public TO gorilatype_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gorilatype_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO gorilatype_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gorilatype_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO gorilatype_app;
```

### 5.3 Row Level Security (RLS) y scoping por usuario

La seguridad y aislamiento de datos entre usuarios está delegada en **Row Level Security (RLS)** a nivel de PostgreSQL:

- **Tablas con RLS habilitado:** Las 6 tablas de dominio del sistema (`users`, `friendships`, `leaderboard_daily`, `leaderboard_global`, `oauth_accounts`, `tests`) más la tabla técnica de control `__EFMigrationsHistory`.
- **Función de contexto `app_current_user_id()`:** Las políticas de RLS evalúan la identidad del usuario actual invocando la función helper:
  ```sql
  CREATE OR REPLACE FUNCTION app_current_user_id() RETURNS uuid AS $$
    SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
  $$ LANGUAGE sql STABLE;
  ```
  Si la variable `app.current_user_id` no fue fijada o es nula, la función retorna `NULL`, impidiendo el acceso a registros restringidos.
- **Fijación de contexto por request vía `AppDbContext`:** En tiempo de ejecución, cada operación sujeta al usuario autenticado inicia una transacción explícita mediante el método `BeginUserScopedTransactionAsync` en `AppDbContext`:

  ```csharp
  public async Task<IDbContextTransaction> BeginUserScopedTransactionAsync(
      Guid userId,
      CancellationToken cancellationToken = default
  )
  {
      var transaction = await Database.BeginTransactionAsync(cancellationToken);

      await Database.ExecuteSqlInterpolatedAsync(
          $"SELECT set_config('app.current_user_id', {userId.ToString()}, true)",
          cancellationToken
      );

      return transaction;
  }
  ```

  El tercer parámetro `is_local = true` en `set_config` asegura que el valor sea local a la transacción en curso. Al hacer commit o rollback, la variable de configuración se restablece automáticamente, evitando cualquier contaminación entre conexiones reutilizadas en el pool.

> [!NOTE]
> **Estado actual de integración:** El método `BeginUserScopedTransactionAsync` está temporalmente conectado a un `user_id` de prueba para pruebas locales en desarrollo. Una vez implementado el middleware de autenticación, el `userId` se extraerá dinámicamente de los claims del JWT de cada request.

### 5.4 Patrón de doble Connection String

La configuración del backend en `.env` requiere dos cadenas de conexión diferenciadas según el contexto de ejecución:

```env
# Runtime de la aplicación (rol gorilatype_app, restringido con RLS)
ConnectionStrings__DefaultConnection="Host=aws-0-us-east-1.pooler.supabase.com;Port=5432;Database=postgres;Username=gorilatype_app.<project-ref>;Password=<password>;SSL Mode=Require;"

# Aplicación de migraciones DDL (rol postgres, superusuario con BYPASSRLS)
ConnectionStrings__MigrationsConnection="Host=aws-0-us-east-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.<project-ref>;Password=<password>;SSL Mode=Require;"
```

> [!IMPORTANT]
> **Parámetros requeridos para Npgsql moderno:**
>
> 1. **`SSL Mode=Require;`** es mandatorio para todas las conexiones hacia Supabase.
> 2. **No usar `Trust Server Certificate`:** Las versiones modernas de `Npgsql` (v7+) eliminaron el soporte para esta opción legacy. Los certificados TLS de Supabase están firmados por autoridades certificadoras válidas, por lo que la validación SSL/TLS por defecto funciona sin configuraciones de bypass inseguras.

### 5.5 Aplicación de migraciones con EF Core

Debido a que `DefaultConnection` utiliza el rol de runtime `gorilatype_app` (el cual no tiene permisos DDL ni `BYPASSRLS`), las migraciones **siempre** deben aplicarse utilizando explícitamente `MigrationsConnection`:

```bash
# Desde el directorio backend/
dotnet ef database update --project src/GorilaType.Api --connection "<MigrationsConnection>"
```
