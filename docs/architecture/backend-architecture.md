# Arquitectura del backend

> Cómo está organizado el backend de GorilaType y cómo fluye una request de punta a punta.

**Última actualización:** 2026-08-13
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
- `appsettings.Example.json` documenta qué claves espera la app, sin valores reales — es la referencia para cualquiera que clone el repo.

Detalle completo de por qué se eligió `.env` en vez de `dotnet user-secrets` → ver historial de decisiones del equipo (o preguntar, si no quedó registrado en otro lado).

---

## 4. Autenticación (JWT)

En progreso — trackeado en un Issue aparte. La infraestructura de JWT (middleware, generación y validación de tokens) se documenta acá una vez que esté mergeada a `develop`. El login real depende de que exista la tabla `Users` (a definir junto con el diagrama de base de datos).

---

## 5. Base de datos

PostgreSQL vía Supabase, acceso con EF Core + `Npgsql.EntityFrameworkCore.PostgreSQL`. Diagrama de tablas → [`docs/architecture/database-diagram.md`](./database-diagram.md).
