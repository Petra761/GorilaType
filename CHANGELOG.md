# Changelog

> Registro histórico de todos los cambios notables realizados en el proyecto **GorilaType**. Este documento sigue las directrices de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

**Última actualización:** 2026-09-03  
**Autor(es):** Petra761

---

## [Unreleased] - v2.0.0-dev

Esta versión representa una reingeniería completa del proyecto desde cero, adoptando una arquitectura moderna, escalable y profesional tanto en el backend como en el frontend.

### Added

- **Backend (.NET 10 API):**
  - Estructura en capas limpias: Controllers, Services, Repositories, Entities y DTOs (`GorilaType.Api`).
  - Modelos de entidades de dominio (`User`, `OAuthAccount`, `Test`, `LeaderboardGlobal`, `LeaderboardDaily`, `Friendship`) y sus configuraciones Fluent API para EF Core y PostgreSQL.
  - Configuración de `AppDbContext` con registro de configuraciones por ensamblado y filtro global de soft delete en `User`.
  - Integración de Entity Framework Core con PostgreSQL (Supabase).
  - Documentación interactiva de API con Scalar (`/scalar`) y endpoints OpenAPI.
  - Configuración basada en variables de entorno seguras mediante `DotNetEnv` y plantilla `.env.example`.
  - Proyecto de pruebas unitarias xUnit (`GorilaType.Api.Tests`).
  - Configuración de formateo de código con CSharpier (`dotnet-tools.json`, `.csharpierrc.json`).
- **Frontend (Vite + React 19 + TypeScript):**
  - Configuración con Vite, React Router y Tailwind CSS v4.
  - Sistema de temas dinámicos multi-paleta con soporte para temas _Serika Dark_ y _Chaos Theory_ mediante variables CSS semánticas.
  - Entorno de desarrollo de componentes aislado con Storybook (`@storybook/react-vite`).
  - Suite de pruebas unitarias y de integración de componentes con Vitest y `@testing-library/react`.
  - Configuración de calidad de código con ESLint 10 y Prettier.
- **Documentación del Proyecto:**
  - Especificación de Historias de Usuario detalladas (`GT-01` a `GT-09`) en `docs/requirements/user-stories/`.
  - Requisitos funcionales (`functional-requirements.md`), no funcionales (`non-functional-requirements.md`) y futuros (`future-requirements.md`).
  - Especificaciones de arquitectura de backend (`backend-architecture.md`) y frontend (`frontend-architecture.md`).
  - Diagrama y especificación del modelo relacional de base de datos v2 (`database-diagram.md`).
  - Guías de estándares de codificación (`coding-standards.md`), convenciones de nomenclatura (`naming-conventions.md`) y guía de estilo Markdown (`markdown-style-guide.md`).
  - Flujo de trabajo con Git y gestión de proyectos en GitHub (`git-flow.md`).
  - Guía de contexto y asistencia para Inteligencia Artificial (`ai-context.md`).
  - Guía profesional de contribución (`CONTRIBUTING.md`).
- **Assets y Branding:**
  - Incorporación de recursos gráficos, imágenes de diagrama de base de datos y logotipos de marca en `docs/images/` y `frontend/src/assets/`.

### Changed

- Actualización y refinamiento del esquema de base de datos a la versión 2 (`docs/architecture/database-diagram.md`), optimizando entidades de usuarios, pruebas y métricas.
- Actualización de estándares de codificación (`coding-standards.md`) para inicializadores contra advertencias `CS8618` y adopción de `= null!;` para strings requeridos.
- Refactorización y estandarización de nombres clave y estructura en las historias de usuario.
- Actualización de metadatos de autoría y fechas en todos los documentos de especificación.

---

## [1.0.0] - 2026-07-15

Versión inicial monolítica/prototipo legacy de GorilaType basada en JavaScript vanilla y almacenamiento local.

### Added

- Mecánica básica de prueba de mecanografía con renderizado dinámico de palabras.
- Temporizador interactivo activado con la primera pulsación de tecla.
- Selector de modo de juego e idioma en la pantalla inicial.
- Sistema de validación de caracteres ingresados con auto-scroll en el contenedor de texto.
- Módulo de autenticación y registro de usuarios en almacenamiento local.
- Pantalla de resultados (`results`) con estadísticas de velocidad y precisión.
- Guardado y visualización del historial de partidas del usuario.

### Fixed

- Corrección en el enrutamiento de la pantalla de resultados y navegación.
- Correcciones en el cálculo del temporizador y validaciones de entrada del teclado.
