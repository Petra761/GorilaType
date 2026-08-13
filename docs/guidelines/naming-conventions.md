# Naming Conventions

> Define cómo se nombran los archivos, carpetas y recursos del proyecto GorilaType (backend en .NET, frontend en React). Este documento es distinto de `coding-standards.md`: ese habla de cómo se escribe el código (sintaxis, casing de clases/métodos/propiedades); este habla de cómo se nombran los archivos, carpetas y recursos que contienen ese código.

**Última actualización:** 2026-07-16
**Autor(es):** Petra761

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

Un solo proyecto Web API (no Clean Architecture con proyectos separados), organizado en capas por carpeta:

```
GorilaType.Api/
├── Controllers/
├── Services/
│ └── Interfaces/
├── Repositories/
│ └── Interfaces/
├── Models/
│ ├── Entities/
│ └── Dtos/
├── Data/ → AppDbContext y configuración de EF Core
├── Middleware/ → middlewares custom (singular, no "Middlewares")
└── Extensions/ → métodos de extensión (ej. transformers de OpenAPI)
```

- Carpetas en `PascalCase`, en inglés, en plural cuando agrupan varios elementos del mismo tipo (`Controllers`, `Services`, `Models`). `Data`, `Middleware` y `Extensions` van en singular por convención de .NET.

### 1.3 DTOs y modelos

| Tipo                        | Sufijo       | Ejemplo                  |
| --------------------------- | ------------ | ------------------------ |
| Entidad de dominio          | (sin sufijo) | `Player.cs`              |
| DTO de salida               | `Dto`        | `PlayerDto.cs`           |
| DTO de entrada / request    | `Request`    | `CreatePlayerRequest.cs` |
| DTO de respuesta específica | `Response`   | `LoginResponse.cs`       |

### 1.4 Endpoints / rutas de API

- En minúsculas, `kebab-case`, en plural para colecciones de recursos.

```
GET  /api/players
GET  /api/players/{id}
POST /api/typing-tests
```

### 1.5 Proyectos de la solución (`.slnx`)

Dos proyectos únicamente — no hay separación en capas como proyectos independientes:

```
GorilaType.Api            → la API en sí (todas las capas conviven acá, por carpeta)
GorilaType.Api.Tests        → tests xUnit
```

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
│ ├── ui/ → componentes reutilizables (botones, inputs)
│ │ └── Button/
│ │ ├── Button.tsx
│ │ ├── Button.stories.tsx
│ │ └── Button.test.tsx
│ └── layout/ → header, sidebar, wrappers de página
├── features/ → lógica agrupada por feature
├── hooks/
│ └── useTheme.ts
├── lib/ → clientes (supabase, fetcher de API)
├── pages/
│ └── Home/
│ └── Home.tsx → una carpeta por página, mismo nombre que el archivo
├── routes/
│ └── index.tsx → definición de rutas
├── services/ → llamadas a la API del backend
├── store/
│ └── theme/
│ └── ThemeContext.tsx → un Context por subcarpeta, PascalCase
├── styles/
│ └── themes/
│ ├── serika-dark.css → kebab-case, un archivo por tema
│ └── chaos-theory.css
└── types/
```

- Carpetas en `camelCase` (`components`, `hooks`, `services`), salvo la subcarpeta de cada componente/página/context, que usa `PascalCase` igual que el archivo principal que contiene (`Button/`, `Home/`, `theme/` es la excepción — ahí `theme` describe el dominio, no un tipo, por eso va en camelCase).

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

### 2.5 Estilos

No usamos CSS Modules — los estilos van con clases utilitarias de Tailwind directo en el `className`, siempre con los tokens semánticos del tema (`bg-primary`, no `bg-blue-600`; ver [`coding-standards.md §12.2`](./coding-standards.md)).

Los únicos archivos `.css` del proyecto son los de tema, en `kebab-case`:

```
styles/themes/serika-dark.css
styles/themes/chaos-theory.css
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

| Elemento                                                    | Convención                             |
| ----------------------------------------------------------- | -------------------------------------- |
| Clase / interfaz C# y su archivo                            | `PascalCase.cs`                        |
| Componente React y su archivo                               | `PascalCase.tsx`                       |
| Carpeta de código (backend)                                 | `PascalCase`                           |
| Carpeta de código (frontend, excepto carpeta de componente) | `camelCase`                            |
| Hook de React                                               | `useCamelCase.ts`                      |
| Servicio (frontend o backend)                               | `camelCase` / `PascalCase` + `Service` |
| Endpoint de API                                             | `kebab-case`, plural                   |
| Clase CSS                                                   | `kebab-case`                           |
| Asset (imagen, ícono)                                       | `kebab-case`                           |
| Variable de entorno                                         | `UPPER_SNAKE_CASE`                     |
