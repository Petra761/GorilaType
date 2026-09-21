# AGENT.md

Este archivo es contexto para agentes de IA que trabajen en este repositorio, no documentación para personas. Prioriza densidad de información sobre legibilidad narrativa. Antes de generar código o documentación en este repo, leelo completo. Para detalle de cualquier punto, seguí el enlace a `docs/`.

## Identidad del proyecto

- Nombre: GorilaType.
- Qué es: plataforma web de mecanografía. No es solo un test — contempla tres módulos: test de mecanografía (MVP), lecciones guiadas estilo TypingClub (post-MVP), modo PvP/battle royale estilo Tetr.io (post-MVP).
- Propósito real: ejercicio de aprendizaje de prácticas profesionales de desarrollo (documentación, Gitflow, Jira, arquitectura, estándares de código), con calidad suficiente para portafolio profesional.
- Repo: monorepo (`docs/`, `backend/`, `frontend/` en un mismo repo). Hospedado en `Petra761/GorilaType`.
- Estado actual: scaffold base de frontend y backend implementado (GT-4). Frontend con rutas y layout funcionando; backend con Clean Architecture, CORS, Swagger, CSharpier y conexión a PostgreSQL vía EF Core. Todavía no hay módulos de negocio implementados (entidades, casos de uso, endpoints reales) — eso empieza en tickets posteriores.

## Regla de oro

Antes de proponer o generar cualquier cosa que contradiga una decisión ya tomada (listada abajo o en `docs/`), preguntá en vez de asumir. Este proyecto se documentó exhaustivamente antes de escribir código precisamente para evitar decisiones implícitas.

## Stack (versiones fijas — no asumir "latest")

| Capa          | Tecnología                                             | Versión |
| :------------ | :----------------------------------------------------- | :------ |
| Frontend      | React                                                  | 19.x    |
| Frontend      | TypeScript                                             | 6.x     |
| Frontend      | Vite                                                   | 8.x     |
| Frontend      | Tailwind CSS                                           | 4.x     |
| Backend       | .NET                                                   | 10      |
| Backend       | Entity Framework Core                                  | —       |
| Base de datos | PostgreSQL                                             | 18.x    |
| Comunicación  | REST (sin intermediarios: Frontend → API → PostgreSQL) | —       |

Tiempo real (SignalR) para PvP: no decidido, no implementar todavía.

## Comandos rápidos (desde la raíz del repo)

- `npm install && npm run setup` — instala dependencias del frontend y hace `dotnet restore` del backend.
- `npm run dev` — levanta frontend y backend juntos.
- `npm run dev:frontend` / `npm run dev:backend` — por separado.
- `npm run format` — formatea frontend (Prettier) y backend (CSharpier) en un solo paso.
- `npm run build:frontend` / `npm run build:backend` — build de cada lado.
- Solución de .NET: `backend/GorilaType.slnx` (formato `.slnx`, no `.sln`).

## Arquitectura — reglas de generación de código

Detalle completo: [docs/01-arquitectura/](./docs/01-arquitectura/README.md)

**Backend** — Clean Architecture, organizado por módulo de negocio dentro de cada capa:

```
backend/
├── GorilaType.Domain/<Módulo>/
├── GorilaType.Application/<Módulo>/{Dtos,Interfaces,UseCases}/
├── GorilaType.Infrastructure/<Módulo>/{Repositories,Persistence/Configurations}/
└── GorilaType.Api/Controllers/
```

- Módulos previstos: `Users`, `TypingTests`, `Content`, `Leaderboard`.
- Acceso a datos: patrón Repository. Nunca acceder al `DbContext` directamente desde un caso de uso.
- DTOs viven en `Application/<Módulo>/Dtos/`. Los controllers de `Api` los reutilizan directamente — no crear DTOs duplicados en `Api`.
- Mapeo EF Core: clases `IEntityTypeConfiguration<T>` en `Infrastructure/<Módulo>/Persistence/Configurations/`, nunca todo en el `DbContext`.
- No crear carpetas de módulo sin contenido real.
- CORS habilitado para el origen del frontend en desarrollo (`http://localhost:5173`).
- Documentación de API: Swagger con UI (`/swagger`, raíz redirige ahí en desarrollo) + Thunder Client para pruebas manuales.
- HTTPS activo por defecto en desarrollo (requisito de OAuth/Supabase).

**Frontend** — organizado por feature/módulo, no por tipo de archivo (estructura ya implementada, no genérica):

```
frontend/src/
├── features/{typing-test,profile,settings,leaderboard,auth,about,not-found}/pages/
├── shared/{components/layout,hooks,utils}/
└── routes/AppRouter.tsx
```

- Rutas ya definidas: `/`, `/profile`, `/settings`, `/leaderboard`, `/auth` (login y registro en la misma página), `/auth/forgot-password`, `/auth/reset-password`, `/about`, `*`. Detalle en [docs/01-arquitectura/frontend.md](./docs/01-arquitectura/frontend.md).
- `MainLayout` (header + `<Outlet />`) en `shared/components/layout/`, envuelve todas las rutas.
- Rutas protegidas: no implementadas todavía, se abordan junto con la feature de `auth`.
- No crear carpetas vacías.
- Gestión de estado: sin librería fija — evaluar por feature.

**Variables sensibles:** centralizadas en `.env`/`.env.example` en la raíz del monorepo (no por subcarpeta), convención `Seccion__Clave`, cargadas en el backend con `DotNetEnv`. Por ahora una sola connection string (`ConnectionStrings__DefaultConnection`); separar runtime/migraciones queda pendiente para cuando se implemente RLS.

**Nomenclatura (ambos lados):** identificadores en inglés. Comentarios de código en español, dirigidos a quien lea el código (no mensajes dirigidos al dueño del repo).

## Flujo de trabajo — obligatorio para todo cambio

Detalle: [docs/02-flujo-de-trabajo/](./docs/02-flujo-de-trabajo/README.md)

- Ramas: `master` + `develop`. Trabajo en `feature/GT-XX-descripcion` o `fix/GT-XX-descripcion`.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.), **sin** ID de Jira en el mensaje.
- Todo cambio entra por Pull Request. Nunca sugerir o hacer merge directo a `develop`/`master`.
- Título del PR: `[GT-XX] Descripción`.
- Jira: tipos de issue = Épica, Story, Task, Bug, Subtask. Estados = `To Do → In Progress → Done` (sin `In Review`). Estimación = story points, no tiempo. Trabajo organizado en sprints.

## Estándares de código

Detalle: [docs/03-estandares-de-codigo/](./docs/03-estandares-de-codigo/README.md)

- Frontend: ESLint + Prettier.
- Backend: CSharpier (correr `dotnet csharpier format .` parado en `backend/`, no desde la raíz — el manifest de la herramienta vive ahí).
- Tests automatizados esperados en ambos lados (backend: al menos unitarios; frontend: componentes).
- CI con linters automáticos: no implementado todavía, no asumir que existe.
- JWT: implementación propia, no usar ASP.NET Identity completo.
- OAuth (GitHub, Discord, Google): el flujo lo maneja el backend, nunca el frontend directamente.

## Reglas de producto no obvias (evitar inferir mal)

Estas decisiones son intencionales, no omisiones — no "corregir" sin confirmar:

- El progreso en vivo del rival **no** existe en el test individual (ahorro de recursos); es exclusivo del PvP (post-MVP).
- Reintentar el mismo test requiere un botón manual explícito, y ese reintento **no** se guarda en el historial ni afecta métricas.
- La exclusión de acentos/ñ en español **no** modifica el texto del test: solo hace que la validación acepte ambas formas de escritura (con o sin tilde/ñ) como correctas.
- Un usuario sin email verificado puede registrarse y usar la cuenta, pero **no** puede participar en nada con otros jugadores (leaderboard, etc.) hasta verificar.
- No hay roles de usuario en el MVP.
- El grid de práctica del perfil mide intensidad por **cantidad de tests por día**, relativa entre días (no por tiempo practicado).
- Imagen de perfil por defecto: generada a partir del nombre si el usuario no sube una; los usuarios OAuth heredan nombre/imagen del proveedor.
- Idiomas del MVP: español e inglés. Todos los modos de test de Monkeytype entran en el MVP, ninguno queda fuera.

## Alcance: MVP vs. post-MVP

Detalle completo: [docs/00-vision-y-alcance.md](./docs/00-vision-y-alcance.md)

**En el MVP:** test completo (todos los modos/opciones de Monkeytype), auth (email+contraseña, OAuth, invitado, recuperación de contraseña), perfil público con historial/récords, leaderboard básico.

**Post-MVP, no implementar todavía (pero el modelo de datos ya las contempla):** lecciones estructuradas, PvP/battle royale con salas por código, monetización (anuncios/compras).

## Branding y diseño

Detalle: [docs/assets/README.md](./docs/assets/README.md)

- Logo: `docs/assets/branding/logo.svg` (ícono de gorila, monocromático, color vía `--logo-color`).
- Banner (ícono + texto "GorilaType" ya combinados, proporción 3:1): `docs/assets/branding/banner.png`. Usado como cabecera de README/CONTRIBUTING/CHANGELOG — no repetir el texto "GorilaType" como título aparte al usarlo.
- Paleta (tema oscuro, tokens): `bg #0b1210`, `surface #121c19`, `surface-elevated #182620`, `border #24352e`, `text-primary #e7f3ed`, `text-secondary #9fb8ae`, `accent #1d9e75`, `accent-hover #26b98a`, `success #4ade80`, `danger #e24b4a`.

## Mapa de documentación

| Archivo                                                                      | Contenido                                     |
| :--------------------------------------------------------------------------- | :-------------------------------------------- |
| [docs/convencion-de-documentacion.md](./docs/convencion-de-documentacion.md) | Formato que debe seguir cualquier doc nuevo   |
| [docs/00-vision-y-alcance.md](./docs/00-vision-y-alcance.md)                 | Visión completa, alcance MVP y roadmap        |
| [docs/01-arquitectura/](./docs/01-arquitectura/README.md)                    | Arquitectura general, backend, frontend, ADRs |
| [docs/02-flujo-de-trabajo/](./docs/02-flujo-de-trabajo/README.md)            | Gitflow y Jira en detalle                     |
| [docs/03-estandares-de-codigo/](./docs/03-estandares-de-codigo/README.md)    | Convenciones de backend y frontend en detalle |
| [docs/04-historias-de-usuario/](./docs/04-historias-de-usuario/README.md)    | Plantilla e índice de historias de usuario    |
| [docs/assets/README.md](./docs/assets/README.md)                             | Convención de nombres de assets y branding    |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                                         | Proceso paso a paso para contribuir           |
| [CHANGELOG.md](./CHANGELOG.md)                                               | Historial de cambios                          |

## Pendiente de decidir (no asumir un valor)

- Licencia del repositorio: se define al cierre del MVP (hoy sin licencia explícita).
- Separación de connection string de runtime (RLS) vs. migraciones (BYPASSRLS): pendiente hasta implementar RLS.
- Límite de jugadores por sala de PvP.
- Herramienta de analítica externa de producto.
