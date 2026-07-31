# HU-28 – Validación Anti-Trampa de Resultados

> Validación de resultados antes de aceptarlos en el historial y el leaderboard.

**Última actualización:** 2026-07-29
**Autor(es):** Marcelo Llanos

---

## Historia

**Como** administrador del sistema

**Quiero** validar que los resultados enviados sean consistentes con una prueba real

**Para** mantener la integridad del leaderboard y el historial de todos los usuarios

## Detalles

- **ID:** HU-28
- **Tiempo estimado:** 2 días
- **Story Points:** 8
- **Prioridad:** Baja

## Criterios de aceptación

- El sistema verifica que el tiempo, la cantidad de caracteres y el WPM reportado sean coherentes entre sí.
- Se rechazan o marcan resultados que excedan límites físicamente razonables.
- Los resultados rechazados no se guardan en el historial ni en el leaderboard.
- El usuario recibe un mensaje claro si su resultado no pudo validarse.
