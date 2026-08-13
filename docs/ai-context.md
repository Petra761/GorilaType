# Contexto para IA

Este archivo existe para pegarlo al inicio de cualquier conversación con una IA (ChatGPT, Claude, Gemini, Copilot) sobre GorilaType, para que tenga contexto sin repetir explicaciones cada vez.

Última actualización: 2026-08-13

---

## Qué es GorilaType

Test/práctica de mecanografía inspirado en Monkeytype. Es un proyecto de aprendizaje enfocado en practicar hábitos profesionales (documentación, Git, estándares de código), no un producto comercial — pero se trata con seriedad profesional. Equipo de 2 personas, ambos en Linux.

---

## Stack

| Parte         | Tecnología                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Backend       | .NET 10, un solo proyecto Web API en capas (Controllers → Services → Repositories → Data)                           |
| Frontend      | Vite + React 19 + TypeScript, React Router (paquete `react-router`, sin `-dom`), Tailwind CSS v4, Storybook, Vitest |
| Base de datos | PostgreSQL vía Supabase, EF Core + Npgsql                                                                           |
| Auth          | JWT (infraestructura lista, login real pendiente de la tabla `Users`)                                               |
| Secretos      | `.env` en la raíz (nunca `dotnet user-secrets`)                                                                     |

---

## Advertencia: este proyecto usa versiones muy recientes

Varias dependencias están en versiones lanzadas después del corte de conocimiento de la mayoría de los modelos de IA. Antes de sugerir código, verificar la sintaxis actual en vez de asumir por entrenamiento — varios patrones "estándar" ya no aplican acá:

- **TypeScript ~7**: `baseUrl` en `tsconfig` está deprecado; los `paths` van sin él, con prefijo `./` explícito.
- **React Router v8**: no existe `react-router-dom`. Todo (`BrowserRouter`, `Routes`, `Route`, etc.) se importa de `react-router` directo.
- **Tailwind v4**: no hay `tailwind.config.js` ni PostCSS por defecto. Se usa el plugin `@tailwindcss/vite` + `@import "tailwindcss";` en el CSS, y `@theme inline` para mapear variables.
- **Vitest 4**: `defineConfig` se importa de `vitest/config`, no de `vite`, para que TypeScript reconozca la propiedad `test`.

Si algo no compila con la sintaxis "de siempre", sospechar primero de esto antes de insistir con el mismo enfoque.

---

## Decisiones ya tomadas — no proponerlas de nuevo

- Clean Architecture / múltiples proyectos por capa → NO. Un solo proyecto, capas por carpeta.
- `dotnet user-secrets` → NO. `.env` + paquete `DotNetEnv`.
- CSS Modules o styled-components → NO. Tailwind con clases semánticas del tema (`bg-primary`, nunca `bg-blue-600`).
- Next.js / rutas por carpeta → NO. React Router declarativo, rutas explícitas en `src/routes/index.tsx`.
- Conventional Commits con scope (`feat(backend):`) → NO. Sin scope (`feat:`).

---

## Antes de generar código: pedir estos archivos

No asumir la convención — pedir que se pegue el archivo relevante antes de escribir nada.

| Si piden...                        | Pedir                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Un endpoint nuevo                  | `Program.cs`, un Controller/Service/Repository existente, `docs/guidelines/coding-standards.md`      |
| Una entidad o DTO nuevo            | Un archivo existente de `Models/Entities/` o `Models/Dtos/`, `docs/architecture/database-diagram.md` |
| Un componente de React nuevo       | Un componente existente completo (`.tsx` + `.stories.tsx` + `.test.tsx`) como plantilla              |
| Un tema de color nuevo             | `src/styles/themes/serika-dark.css`, el bloque `@theme inline` de `src/index.css`                    |
| Algo de Git/flujo de trabajo       | `CONTRIBUTING.md`, `docs/workflow/git-flow.md`                                                       |
| Duda de nombres de archivo/carpeta | `docs/guidelines/naming-conventions.md`                                                              |

Si el archivo pedido no existe todavía, decirlo explícitamente en vez de inventar una convención nueva.

---

## Reglas fijas

1. Backend: `dotnet csharpier format .` antes de dar algo por terminado.
2. Frontend: `npm run format` antes de dar algo por terminado.
3. Todo componente de `components/ui/` se entrega en trío (`.tsx` + `.stories.tsx` + `.test.tsx`).
4. Ningún secreto se escribe en código ni en `appsettings.json` — siempre referencia a `.env` / `appsettings.Example.json`.
5. Controllers no acceden a `AppDbContext` directo; siempre Controller → Service → Repository.
6. Commits en formato `tipo: descripción`, sin scope entre paréntesis.
7. Ante ambigüedad real, preguntar antes de asumir.
