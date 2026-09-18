<div align="center">

<img src="./docs/assets/branding/banner.png" alt="GorilaType" width="360">

# GUÍA DE CONTRIBUCIÓN

</div>

---

## 1. Antes de empezar

Este documento describe el flujo de trabajo del proyecto, pensado tanto para el desarrollo en solitario actual como para una eventual colaboración futura. Todo cambio, sin excepción, sigue este proceso.

Lectura previa recomendada:

- [docs/01-arquitectura/](./docs/01-arquitectura/README.md) — cómo está organizado el código
- [docs/02-flujo-de-trabajo/gitflow.md](./docs/02-flujo-de-trabajo/gitflow.md) — ramas y commits
- [docs/02-flujo-de-trabajo/jira.md](./docs/02-flujo-de-trabajo/jira.md) — tickets y sprints
- [docs/03-estandares-de-codigo/](./docs/03-estandares-de-codigo/README.md) — convenciones de backend y frontend

---

## 2. Flujo de trabajo

1. Todo trabajo parte de un ticket en Jira (`GT-XX`). Si no existe todavía, se crea antes de empezar a programar.
2. Se crea la rama desde `develop` (o desde `master` para un `hotfix/*`), con el formato `feature/GT-XX-descripcion-corta` o `fix/GT-XX-descripcion-corta`.
3. Se desarrolla el cambio siguiendo los estándares de código correspondientes ([backend](./docs/03-estandares-de-codigo/backend-dotnet.md) / [frontend](./docs/03-estandares-de-codigo/frontend-react-ts.md)).
4. Se agregan o actualizan los tests automatizados correspondientes al cambio.
5. Se hacen commits siguiendo Conventional Commits, sin incluir el ID de Jira en el mensaje.
6. Se abre un Pull Request hacia `develop` (o `master`, según corresponda), con el ID de Jira entre corchetes en el título: `[GT-XX] Descripción del cambio`.
7. El Pull Request se revisa antes de mergear. No se hace merge directo bajo ninguna circunstancia.
8. Al mergear, el ticket de Jira pasa a `Done` mediante la integración con GitHub.

---

## 3. Documentación

Si el cambio afecta una decisión documentada (arquitectura, flujo de trabajo, alcance del MVP), la documentación correspondiente en `docs/` se actualiza en el mismo Pull Request, siguiendo el formato definido en [docs/convencion-de-documentacion.md](./docs/convencion-de-documentacion.md).

Las decisiones arquitectónicas relevantes se registran como un nuevo ADR en [docs/01-arquitectura/decisiones-arquitectonicas.md](./docs/01-arquitectura/decisiones-arquitectonicas.md).

---

## 4. Historias de usuario

Toda historia de usuario nueva sigue la plantilla de [docs/04-historias-de-usuario/README.md](./docs/04-historias-de-usuario/README.md): una sola necesidad por historia, con criterios de aceptación verificables.

---

## 5. Releases

Cada Pull Request mergeado a `develop` o a `master` se etiqueta con una versión, siguiendo versionado semántico (`vMAYOR.MENOR.PARCHE`). El cambio se agrega también al [CHANGELOG.md](./CHANGELOG.md).
