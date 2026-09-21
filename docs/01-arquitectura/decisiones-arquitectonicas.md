## ADR-01 — Gestión de variables sensibles y configuración

**Fecha:** 2026-09-20
**Estado:** Aceptada

### Contexto

El proyecto necesita manejar credenciales (base de datos, y a futuro JWT, OAuth, SMTP) sin subirlas al repo, en un monorepo con frontend y backend.

### Decisión

Se centralizan todas las variables sensibles en un único `.env` en la raíz del monorepo (con su `.env.example` correspondiente, sí versionado), usando la convención de nombres `Seccion__Clave` (doble guion bajo), compatible nativamente con el sistema de configuración de ASP.NET Core. Se carga en el backend con la librería `DotNetEnv`. Por ahora se usa una sola connection string (`ConnectionStrings__DefaultConnection`); separar una conexión de runtime (con RLS) de una de migraciones (BYPASSRLS) queda pendiente para cuando se implemente RLS en Supabase.

### Alternativas consideradas

- **User Secrets de .NET**: se descartó porque solo cubre al backend, y se buscaba un único lugar para todo el monorepo (incluyendo futuras claves del frontend).
- **Un `.env` por subcarpeta** (`frontend/.env`, `backend/.env`): se descartó por preferir un solo punto centralizado de configuración.

### Consecuencias

Hay que recordar mantener `.env.example` actualizado cada vez que se agregue una variable nueva, y `.env` debe estar en el `.gitignore` raíz. Al separar los roles de conexión (RLS) más adelante, habrá que actualizar el `DbContext` para usar la conexión de migraciones al generarlas.

---

## ADR-02 — Documentación de la API con Swagger

**Fecha:** 2026-09-20
**Estado:** Aceptada

### Contexto

Se necesita una forma de documentar y probar los endpoints de la API durante el desarrollo.

### Decisión

Se usa Swagger completo (Swashbuckle.AspNetCore, con UI interactiva), habilitado solo en el entorno de desarrollo. La raíz (`/`) redirige automáticamente a `/swagger` en desarrollo. Se complementa con Thunder Client (extensión de VS Code) para pruebas manuales del día a día; ambas herramientas conviven sin conflicto.

### Alternativas consideradas

- **Solo OpenAPI nativo** (sin UI, solo el JSON): se descartó por perder la interfaz interactiva, útil tanto para desarrollo como para mostrar el proyecto (valor de portafolio).
- **Omitir documentación de API y usar solo Thunder Client**: se descartó porque Swagger aporta documentación versionada y visible para cualquiera que abra el proyecto, no solo desde una colección local de Thunder Client.

### Consecuencias

Ninguna relevante; es una dependencia liviana y estándar del ecosistema .NET.

---

## ADR-03 — HTTPS por defecto en desarrollo local

**Fecha:** 2026-09-20
**Estado:** Aceptada

### Contexto

El flujo de OAuth (GitHub, Discord, Google) y algunas configuraciones de Supabase pueden requerir HTTPS incluso en pruebas locales.

### Decisión

Se mantiene `app.UseHttpsRedirection()` activo también en desarrollo, y se reordena `launchSettings.json` dejando el profile `https` primero, para que `dotnet run` (sin flags) levante la API en HTTPS por defecto.

### Alternativas consideradas

- **Desactivar HTTPS en desarrollo** (`UseHttpsRedirection()` solo fuera de `Development`): se descartó porque hubiera exigido correr en HTTPS solo puntualmente al probar OAuth, generando inconsistencia.

### Consecuencias

Hace falta confiar el certificado de desarrollo una vez por máquina (`dotnet dev-certs https --trust`).

---

## ADR-04 — Automatización de comandos de desarrollo desde la raíz

**Fecha:** 2026-09-20
**Estado:** Aceptada

### Contexto

Al ser un monorepo con frontend (npm) y backend (.NET), correr y formatear cada proyecto por separado implica moverse entre carpetas y recordar comandos distintos.

### Decisión

Se agrega un `package.json` en la raíz del monorepo con scripts npm que centralizan los comandos más comunes (`dev`, `dev:frontend`, `dev:backend`, `format`, `build:backend`, `setup`, etc.), usando `concurrently` para levantar frontend y backend en simultáneo. `setup` instala dependencias de frontend y hace `dotnet restore` del backend en un solo paso. No se usan npm workspaces por ahora (quedan dos `node_modules` independientes, uno en la raíz y otro en `frontend/`); es una opción a evaluar más adelante.

### Alternativas consideradas

- **Scripts `.cmd`/`.sh` por proyecto**: se descartó por tener que mantener versiones separadas por sistema operativo desde el inicio.
- **npm workspaces desde ahora**: se descartó por complejidad innecesaria para el alcance actual.

### Consecuencias

Cualquiera que clone el repo corre `npm install` y `npm run setup` desde la raíz para dejar todo listo. Si más adelante se adoptan workspaces, este ADR debería marcarse como reemplazado por uno nuevo.
