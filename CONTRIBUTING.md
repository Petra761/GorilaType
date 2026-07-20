# Contributing

> Guía rápida de comandos para el trabajo diario en GorilaType: Git, backend (.NET) y frontend (React). Para el detalle de reglas y convenciones, ver [`docs/workflow/git-flow.md`](./docs/workflow/git-flow.md), [`docs/guidelines/coding-standards.md`](./docs/guidelines/coding-standards.md) y [`docs/guidelines/naming-conventions.md`](./docs/guidelines/naming-conventions.md).

**Última actualización:** 2026-07-16
**Autor(es):** Equipo GorilaType

---

## 1. Requisitos previos

<!-- TODO: confirmar versiones exactas usadas en el proyecto -->

- .NET SDK
- Node.js + npm
- Git

---

## 2. Git

### Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd gorilatype
```

### Actualizar `develop` antes de empezar algo nuevo

```bash
git checkout develop
git pull origin develop
```

### Crear una rama nueva

```bash
git checkout -b feature/nombre-corto-descriptivo
```

### Cambiar de rama

```bash
git checkout nombre-de-la-rama
```

### Ver en qué rama estoy y qué ramas existen

```bash
git branch          # ramas locales
git branch -a       # ramas locales + remotas
```

### Guardar cambios (commit)

```bash
git add .
git commit -m "feat: descripción corta del cambio"
```

### Subir la rama al repositorio remoto

```bash
git push origin feature/nombre-corto-descriptivo
```

### Traer cambios de `develop` a mi rama actual

```bash
git checkout feature/nombre-corto-descriptivo
git merge develop
```

### Descartar cambios locales no guardados

```bash
git checkout -- nombre-del-archivo    # un archivo puntual
git restore .                          # todos los cambios sin commit
```

### Ver historial de commits (resumido)

```bash
git log --oneline
```

---

## 3. Backend (.NET)

### Restaurar dependencias del proyecto

```bash
dotnet restore
```

### Compilar

```bash
dotnet build
```

### Ejecutar el backend

```bash
dotnet run
```

### Instalar un paquete NuGet

```bash
dotnet add package NombreDelPaquete
```

### Migraciones (Entity Framework Core)

Crear una nueva migración:

```bash
dotnet ef migrations add NombreDeLaMigracion
```

Aplicar migraciones pendientes a la base de datos:

```bash
dotnet ef database update
```

Revertir la última migración aplicada:

```bash
dotnet ef database update NombreDeLaMigracionAnterior
```

Eliminar la última migración creada (si todavía no se aplicó a la base de datos):

```bash
dotnet ef migrations remove
```

> ⚠️ Si `dotnet ef` no es reconocido, instalar la herramienta global una sola vez:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

---

## 4. Frontend (React)

### Instalar dependencias

```bash
npm install
```

### Ejecutar el frontend en modo desarrollo

```bash
npm run dev
```

### Instalar un paquete nuevo

```bash
npm install nombre-del-paquete
```

### Instalar un paquete solo para desarrollo

```bash
npm install nombre-del-paquete --save-dev
```

### Generar el build de producción

```bash
npm run build
```

---

## 5. Flujo diario resumido

1. `git checkout develop && git pull origin develop`
2. `git checkout -b feature/nombre-de-la-tarea`
3. Trabajar, hacer commits con prefijo (`feat`, `fix`, `docs`, etc.)
4. `dotnet build` / `npm run dev` para probar localmente
5. `git push origin feature/nombre-de-la-tarea`
6. Abrir Pull Request hacia `develop`