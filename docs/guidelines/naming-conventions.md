# Naming Conventions

> Define cómo se nombran los archivos, carpetas y recursos del proyecto GorilaType (backend en .NET, frontend en React). Este documento es distinto de `coding-standards.md`: ese habla de cómo se escribe el código (sintaxis, casing de clases/métodos/propiedades); este habla de cómo se nombran los archivos, carpetas y recursos que contienen ese código.

**Última actualización:** 2026-07-16
**Autor(es):** Equipo GorilaType

---

## 1. Backend (.NET)

### 1.1 Archivos

- El nombre del archivo `.cs` siempre coincide exactamente con el nombre de la clase, interfaz o enum que contiene (regla estándar de C#).

```
IPlayerService.cs      → contiene: public interface IPlayerService
PlayerService.cs       → contiene: public class PlayerService
PlayerDto.cs            → contiene: public class PlayerDto
```

- Un archivo = un tipo público principal. No mezclar varias clases públicas grandes en un mismo archivo.

### 1.2 Carpetas

> ⚠️ **Nota:** asumo una organización por capas básica (Controllers, Services, Repositories, Models). Si el backend sigue otra arquitectura (Clean Architecture con proyectos separados, Vertical Slice, etc.), avisame para ajustar esta sección.

```
GorilaType.Api/
├── Controllers/
├── Services/
│   └── Interfaces/
├── Repositories/
│   └── Interfaces/
├── Models/
│   ├── Entities/
│   └── Dtos/
└── Middlewares/
```

- Carpetas en `PascalCase`, en inglés, en plural cuando agrupan varios elementos del mismo tipo (`Controllers`, `Services`, `Models`).

### 1.3 DTOs y modelos

| Tipo | Sufijo | Ejemplo |
|---|---|---|
| Entidad de dominio | (sin sufijo) | `Player.cs` |
| DTO de salida | `Dto` | `PlayerDto.cs` |
| DTO de entrada / request | `Request` | `CreatePlayerRequest.cs` |
| DTO de respuesta específica | `Response` | `LoginResponse.cs` |

### 1.4 Endpoints / rutas de API

- En minúsculas, `kebab-case`, en plural para colecciones de recursos.

```
GET  /api/players
GET  /api/players/{id}
POST /api/typing-tests
```

### 1.5 Proyectos de la solución (`.csproj`)

- Formato: `GorilaType.<Capa>`

```
GorilaType.Api
GorilaType.Application
GorilaType.Domain
GorilaType.Infrastructure
```

> ⚠️ Esto asume separación en capas como proyectos independientes. Si el backend es un único proyecto (`GorilaType.Api` solo), esta sección se simplifica o se elimina.

---

## 2. Frontend (React)

### 2.1 Componentes

- Archivo de componente: `PascalCase`, mismo nombre que el componente exportado, extensión `.tsx` (o `.jsx` si no usan TypeScript).

```
PlayerCard.tsx          → export default function PlayerCard()
TypingTestScreen.tsx    → export default function TypingTestScreen()
```

- Un componente principal por archivo.

### 2.2 Carpetas

```
src/
├── components/
│   └── PlayerCard/
│       ├── PlayerCard.tsx
│       └── PlayerCard.module.css
├── pages/
│   └── TypingTestPage.tsx
├── hooks/
│   └── useTypingTest.ts
├── services/
│   └── playerService.ts
├── contexts/
│   └── AuthContext.tsx
└── utils/
    └── formatTime.ts
```

- Carpetas en `camelCase` (`components`, `hooks`, `services`), salvo la subcarpeta de cada componente, que usa el mismo `PascalCase` que el componente (`PlayerCard/`).

### 2.3 Hooks personalizados

- Siempre empiezan con `use`, en `camelCase`.

```
useTypingTest.ts
useAuth.ts
```

### 2.4 Servicios / llamadas a API

- `camelCase`, sufijo `Service`.

```
playerService.ts
authService.ts
```

### 2.5 Estilos (CSS / CSS Modules)

- Archivo: mismo nombre que el componente, sufijo `.module.css`.
- Clases dentro del archivo: `kebab-case`.

```css
/* PlayerCard.module.css */
.player-card { }
.player-card-header { }
```

### 2.6 Assets (imágenes, íconos, fuentes)

- `kebab-case`, descriptivo, sin espacios.

```
gorilla-logo.svg
keyboard-icon.svg
background-pattern.png
```

---

## 3. Variables de entorno

- `UPPER_SNAKE_CASE`, con prefijo según el stack cuando aplique (por ejemplo `VITE_` o `REACT_APP_` en frontend, según el bundler usado).

```
API_BASE_URL=
JWT_SECRET=
VITE_API_URL=
```

---

## 4. Archivos de configuración y raíz del proyecto

- `kebab-case`, siguiendo la convención estándar de cada herramienta (no se fuerza PascalCase en archivos que las herramientas esperan en minúscula).

```
docker-compose.yml
appsettings.json
.env.example
```

---

## 5. Resumen rápido

| Elemento | Convención |
|---|---|
| Clase / interfaz C# y su archivo | `PascalCase.cs` |
| Componente React y su archivo | `PascalCase.tsx` |
| Carpeta de código (backend) | `PascalCase` |
| Carpeta de código (frontend, excepto carpeta de componente) | `camelCase` |
| Hook de React | `useCamelCase.ts` |
| Servicio (frontend o backend) | `camelCase` / `PascalCase` + `Service` |
| Endpoint de API | `kebab-case`, plural |
| Clase CSS | `kebab-case` |
| Asset (imagen, ícono) | `kebab-case` |
| Variable de entorno | `UPPER_SNAKE_CASE` |