# Git Flow

> Define el flujo de trabajo con Git que se usa en GorilaType: ramas, prefijos de commits y el proceso para llevar una feature desde que se empieza hasta que se integra.

**Última actualización:** 2026-09-04
**Autor(es):** Petra761

---

## 1. Ramas

Usamos un modelo simplificado de Git Flow, con dos ramas principales y una rama de trabajo por tarea.

| Rama        | Propósito                                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `master`    | Código en producción. Solo se actualiza mediante merge desde `develop` cuando hay una release estable. Nunca se trabaja directamente sobre `master`. |
| `develop`   | Rama de integración. Contiene el código más reciente ya probado, listo para la siguiente release. Todas las `feature/*` se mergean acá.              |
| `feature/*` | Rama de trabajo para una tarea, funcionalidad o corrección puntual. Sale de `develop` y vuelve a `develop`.                                          |

### Nomenclatura de `feature/*`

```
feature/nombre-corto-descriptivo
```

- En inglés, en `kebab-case`.
- Descriptivo pero corto (idealmente 2 a 4 palabras).
- Si la tarea tiene un número de ticket/issue, se antepone.

**Ejemplos:**

```
feature/login-validation
feature/45-fix-keyboard-lag
feature/update-readme
```

> No usamos `release/*` ni `hotfix/*` por ahora. Si el proyecto crece y se necesita un flujo más formal para releases o parches urgentes en producción, se agregan más adelante y este documento se actualiza.

---

## 2. Tablero de GitHub Project

Usamos un Project de 3 columnas, sin campos personalizados:

| Columna         | Significado                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| **Todo**        | Issue creado, todavía sin empezar.                                                       |
| **In Progress** | Alguien está trabajando en la rama vinculada.                                            |
| **Done**        | El PR se mergeó a `develop` y el Issue se cerró (automático, por el vínculo rama-Issue). |

El movimiento entre columnas es manual excepto el pase a **Done**, que ocurre solo al mergear el PR de la rama vinculada.

---

## 3. Prefijos de commits

Cada commit debe empezar con un prefijo que indique el tipo de cambio, seguido de dos puntos y una descripción corta en modo imperativo.

```
<prefijo>: <descripción corta>
```

| Prefijo    | Uso                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------- |
| `feat`     | Nueva funcionalidad.                                                                                |
| `fix`      | Corrección de un bug.                                                                               |
| `docs`     | Cambios solo en documentación (`.md`, comentarios de docs, etc.).                                   |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige un bug (reordenar, limpiar, renombrar).     |
| `chore`    | Tareas de mantenimiento que no afectan el código fuente en sí (dependencias, configuración, build). |

**Ejemplos:**

```
feat: agregar validación de correo en el login
fix: corregir crash al presionar tecla shift
docs: actualizar guía de git flow
refactor: extraer lógica de validación a un helper
chore: actualizar dependencias de npm
```

- Un commit = un cambio lógico. No mezclar un `feat` con un `fix` en el mismo commit.
- La descripción va en minúscula y sin punto final.

---

## 4. Flujo de trabajo

1. Crear (o tomar) un Issue en GitHub — cae solo en la columna **Todo** del Project.
2. Vincular una rama desde el Issue (barra lateral **Development** → **Create a branch**, o **Link a branch** si ya la creaste vos manualmente con `git checkout -b`). Este vínculo es lo que hace que el Issue se cierre solo cuando el PR de esa rama se mergea — no hace falta escribir `Closes #N` en ningún lado.
3. Mover la tarjeta a **In Progress** (vincular la rama no la mueve sola).
4. Actualizar `develop` localmente:

```bash
   git checkout develop
   git pull origin develop
```

5. Pararse en la rama vinculada (o crearla si no lo hiciste desde el Issue):

```bash
   git checkout -b feature/nombre-corto-descriptivo
```

6. Trabajar y hacer commits siguiendo los prefijos de la sección 3.
7. Subir la rama:
   ```bash
   git push origin feature/nombre-corto-descriptivo
   ```
8. Abrir un Pull Request hacia `develop` (nunca directo a `master`).
9. Esperar revisión y aprobación antes de mergear.
10. Una vez mergeado, borrar la rama `feature/*` (local y remota).

---

## 5. Reglas generales

- Nunca se hacen commits directos sobre `master` o `develop`; todo pasa por `feature/*` y Pull Request.
- Antes de abrir el PR, la rama debe estar actualizada con `develop` (rebase o merge, a definir por el equipo) para evitar conflictos grandes al mergear.
- El paso de `develop` a `master` se hace solo cuando el equipo decide que ese estado está listo para producción.

---

## 6. Versionamiento semántico (SemVer)

GorilaType implementa el estándar de [Semantic Versioning 2.0.0](https://semver.org/lang/es/) para el etiquetado y control de versiones del proyecto en producción:

```
vMAYOR.MENOR.PARCHE (ej. v0.1.0)
```

### 6.1 Estado de desarrollo activo (`0.x.x`)

- Mientras el proyecto se encuentre en desarrollo activo, construcción de cimientos e iteración de arquitectura, la versión se mantendrá en el rango **`0.x.x`**.
- La versión **`1.0.0`** queda reservada de forma estricta para cuando exista el primer **flujo end-to-end mínimamente usable** (por ejemplo: registro de usuario → inicio de sesión / JWT → ejecución y persistencia de un test de mecanografía en base de datos), no antes.

### 6.2 Criterios de incremento de versión (Bump)

El incremento de números se evalúa únicamente al preparar un pase a `master`, considerando los cambios integrados desde el último release:

| Componente           | Tipo de cambio                                | Criterio y ejemplo                                                                                                                                 |
| -------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PARCHE** (`0.x.Z`) | Bugfix (`fix`)                                | Correcciones de errores que no rompen compatibilidad ni alteran firmas públicas (ej. corrección en fórmula de consistencia o fix de estilos CSS).  |
| **MENOR** (`0.Y.0`)  | Nueva funcionalidad (`feat`)                  | Nuevas características o módulos compatibles hacia atrás (ej. soporte para leaderboard diario, nuevo tema visual).                                 |
| **MAYOR** (`X.0.0`)  | Ruptura de compatibilidad (_breaking change_) | Modificaciones incompatibles en contratos públicos existentes (ej. cambio en el payload o firma de JWT ya emitidos) o el hito fundacional `1.0.0`. |

> [!NOTE]
> Durante la serie `0.x.x`, los cambios de arquitectura que ajusten APIs internas o contratos no estables se absorben habitualmente mediante incrementos de versión **MENOR**, documentando siempre de forma explícita el impacto en [`CHANGELOG.md`](../../CHANGELOG.md).

### 6.3 Creación y publicación de tags

Los tags de Git representan versiones formales de producción y **se crean exclusivamente al hacer merge hacia `master`** (nunca en ramas `feature/*` ni en merges diarios a `develop`):

1. Completar el merge de `develop` a `master`.
2. Crear un tag anotado con la versión y un mensaje descriptivo:
   ```bash
   git checkout master
   git pull origin master
   git tag -a v0.1.0 -m "release: v0.1.0 - primer flujo de conexion a base de datos y entidades"
   ```
3. Publicar el tag al repositorio remoto:

   ```bash
   # Publicar un tag específico
   git push origin v0.1.0

   # O publicar todos los tags locales pendientes
   git push --tags
   ```
