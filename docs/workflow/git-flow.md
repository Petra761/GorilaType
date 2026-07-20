# Git Flow

> Define el flujo de trabajo con Git que se usa en GorilaType: ramas, prefijos de commits y el proceso para llevar una feature desde que se empieza hasta que se integra.

**Última actualización:** 2026-07-16
**Autor(es):** Equipo GorilaType

---

## 1. Ramas

Usamos un modelo simplificado de Git Flow, con dos ramas principales y una rama de trabajo por tarea.

| Rama | Propósito |
|---|---|
| `master` | Código en producción. Solo se actualiza mediante merge desde `develop` cuando hay una release estable. Nunca se trabaja directamente sobre `master`. |
| `develop` | Rama de integración. Contiene el código más reciente ya probado, listo para la siguiente release. Todas las `feature/*` se mergean acá. |
| `feature/*` | Rama de trabajo para una tarea, funcionalidad o corrección puntual. Sale de `develop` y vuelve a `develop`. |

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

## 2. Prefijos de commits

Cada commit debe empezar con un prefijo que indique el tipo de cambio, seguido de dos puntos y una descripción corta en modo imperativo.

```
<prefijo>: <descripción corta>
```

| Prefijo | Uso |
|---|---|
| `feat` | Nueva funcionalidad. |
| `fix` | Corrección de un bug. |
| `docs` | Cambios solo en documentación (`.md`, comentarios de docs, etc.). |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige un bug (reordenar, limpiar, renombrar). |
| `chore` | Tareas de mantenimiento que no afectan el código fuente en sí (dependencias, configuración, build). |

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

## 3. Flujo de trabajo

1. Actualizar `develop` localmente:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crear la rama de la tarea desde `develop`:
   ```bash
   git checkout -b feature/nombre-corto-descriptivo
   ```
3. Trabajar y hacer commits siguiendo los prefijos de la sección 2.
4. Subir la rama:
   ```bash
   git push origin feature/nombre-corto-descriptivo
   ```
5. Abrir un Pull Request hacia `develop` (nunca directo a `master`).
6. Esperar revisión y aprobación antes de mergear.
7. Una vez mergeado, borrar la rama `feature/*` (local y remota).

---

## 4. Reglas generales

- Nunca se hacen commits directos sobre `master` o `develop`; todo pasa por `feature/*` y Pull Request.
- Antes de abrir el PR, la rama debe estar actualizada con `develop` (rebase o merge, a definir por el equipo) para evitar conflictos grandes al mergear.
- El paso de `develop` a `master` se hace solo cuando el equipo decide que ese estado está listo para producción.