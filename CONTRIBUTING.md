# 🦍 Contributing to GorilaType

> Guía rápida para trabajar en el proyecto: cómo se organiza el trabajo, comandos del día a día, y qué revisar antes de subir cualquier cambio a `develop`. Para el detalle de reglas y convenciones, seguí los enlaces de cada sección.

**Última actualización:** 2026-08-13
**Autor(es):** Herberth

---

## 📋 Índice

- [🦍 Contributing to GorilaType](#-contributing-to-gorilatype)
  - [📋 Índice](#-índice)
  - [🧰 Requisitos previos](#-requisitos-previos)
  - [📌 Flujo de trabajo](#-flujo-de-trabajo)
  - [🔧 Más comandos de Git útiles](#-más-comandos-de-git-útiles)
  - [🖥️ Backend (.NET)](#️-backend-net)
  - [🎨 Frontend (React)](#-frontend-react)
  - [✅ Checklist antes de subir a `develop`](#-checklist-antes-de-subir-a-develop)
  - [🗂️ Dónde encontrar cada cosa](#️-dónde-encontrar-cada-cosa)

---

## 🧰 Requisitos previos

- .NET SDK 10
- Node.js + npm
- Git

```bash
git clone <url-del-repositorio>
cd GorilaType
```

Backend: copiá `.env.example` → `.env` en la raíz del repo y pedile los valores reales a un compañero (nunca se comparten por git, ver [`docs/architecture/backend-architecture.md`](./docs/architecture/backend-architecture.md)).

---

## 📌 Flujo de trabajo

1. 📝 Creá un Issue en GitHub describiendo la tarea (o tomá uno ya creado) — cae automáticamente en la columna **Todo** del Project.
2. 🔗 Desde el Issue, en la barra lateral **Development**, vinculá tu rama:
   - Si no la creaste todavía: **Create a branch** (GitHub la crea y la vincula sola).
   - Si ya la creaste manualmente (`git checkout -b feature/...`): **Link a branch** y elegila de la lista.
3. 🗂️ Movete vos mismo la tarjeta a **In Progress** — vincular la rama no la mueve automáticamente 
4. 🌿 Actualizá `develop` y parate en tu rama:
```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-corto-descriptivo
```
5. 💻 Trabajá en commits pequeños con [Conventional Commits](./docs/workflow/git-flow.md#2-prefijos-de-commits).
6. ✅ Corré el [checklist de abajo](#-checklist-antes-de-subir-a-develop) antes de pushear.
7. ⬆️ Subí la rama y abrí un Pull Request hacia `develop` (nunca directo a `master`). En la descripción escribí `Closes #N` (número real del Issue) — así, al mergear, el Issue se cierra solo y la tarjeta pasa a **Done**.
   > ⚠️ Esto solo funciona si `develop` es la rama *default* del repo — todavía está pendiente esa decisión (ver nota en `git-flow.md`).
```bash
   git push origin feature/nombre-corto-descriptivo
```
8. 🗑️ Cuando el PR se mergea, borrá la rama (local y remota).
Detalle completo de ramas, nomenclatura y reglas → [`docs/workflow/git-flow.md`](./docs/workflow/git-flow.md)

## 🔧 Más comandos de Git útiles

```bash
git branch              # ramas locales
git branch -a            # ramas locales + remotas
git log --oneline          # historial resumido
git restore .                # descartar todos los cambios sin commit
git checkout -- archivo.ext    # descartar cambios de un archivo puntual
git merge develop                # traer cambios nuevos de develop a mi rama actual
```

---

## 🖥️ Backend (.NET)

```bash
dotnet restore              # restaurar dependencias
dotnet build                 # compilar (0 warnings es la meta)
dotnet run                    # correr la API (abre en /scalar)
dotnet test                    # correr los tests (xUnit)
dotnet csharpier format .       # formatear
dotnet csharpier check .         # verificar formateo sin modificar
```

Instalar un paquete NuGet:
```bash
dotnet add package NombreDelPaquete
```

Arquitectura en capas, convención de `.env`, y patrón de JWT → [`docs/guidelines/coding-standards.md`](./docs/guidelines/coding-standards.md) y [`docs/architecture/backend-architecture.md`](./docs/architecture/backend-architecture.md)

<details>
<summary>📦 Migraciones de Entity Framework Core</summary>

```bash
dotnet ef migrations add NombreDeLaMigracion     # crear migración
dotnet ef database update                          # aplicar migraciones pendientes
dotnet ef database update NombreAnterior             # revertir a una migración anterior
dotnet ef migrations remove                            # eliminar la última (si no se aplicó)
```

> ⚠️ Si `dotnet ef` no es reconocido: `dotnet tool install --global dotnet-ef`
</details>

---

## 🎨 Frontend (React)

```bash
npm install           # instalar dependencias
npm run dev             # correr en modo desarrollo
npm run test              # correr tests (Vitest)
npm run storybook           # ver componentes aislados
npm run format                # formatear (Prettier)
npm run format:check            # verificar formateo sin modificar
npm run build                     # build de producción
```

Cada componente nuevo en `components/ui/` se crea como un **trío**:

```
Button/
├── Button.tsx ← el componente
├── Button.stories.tsx ← cómo se ve (Storybook)
└── Button.test.tsx ← que funciona (Vitest + Testing Library)
```

Estructura de carpetas, alias `@/`, sistema de temas → [`docs/architecture/frontend-architecture.md`](./docs/architecture/frontend-architecture.md)

---

## ✅ Checklist antes de subir a `develop`

Aplica a **cualquier cambio**, sea backend, frontend o solo docs:

- [ ] 🎨 Formateado (`dotnet csharpier format .` y/o `npm run format`)
- [ ] 🧪 Tests en verde (`dotnet test` y/o `npm run test`)
- [ ] 🔒 Sin vulnerabilidades nuevas (`dotnet build` sin warnings / `npm audit` en 0)
- [ ] 📝 Documentación actualizada si el cambio lo amerita
- [ ] 🕵️ `git status` revisado — sin `.env`, `node_modules` ni secretos reales en la lista
- [ ] 💬 Commits con prefijo correcto y sin scope (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)

---

## 🗂️ Dónde encontrar cada cosa

| Necesito saber... | Dónde está |
|---|---|
| Cómo se nombran ramas y commits | [`docs/workflow/git-flow.md`](./docs/workflow/git-flow.md) |
| Convenciones de código C# y React | [`docs/guidelines/coding-standards.md`](./docs/guidelines/coding-standards.md) |
| Cómo se nombran archivos y carpetas | [`docs/guidelines/naming-conventions.md`](./docs/guidelines/naming-conventions.md) |
| Cómo está armado el backend | [`docs/architecture/backend-architecture.md`](./docs/architecture/backend-architecture.md) |
| Cómo está armado el frontend y los temas | [`docs/architecture/frontend-architecture.md`](./docs/architecture/frontend-architecture.md) |
| Diagrama de base de datos | [`docs/architecture/database-diagram.md`](./docs/architecture/database-diagram.md) |
| Requisitos funcionales / no funcionales | [`docs/requirements/`](./docs/requirements/) |
| Cómo usar IA para trabajar en este proyecto | [`docs/ai-context.md`](./docs/ai-context.md) |