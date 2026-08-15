# GT-08 – Leaderboard Global

> Ranking global de usuarios validado contra resultados fraudulentos.

**Última actualización:** 2026-08-04
**Autor(es):** Jmarcelo

---

## Historia

**Como** usuario  
**Quiero** ver un ranking global confiable  
**Para** comparar mi rendimiento con otros usuarios

---

## Detalles de Subtareas

### GT-08.1 – Validación Anti-Trampa de Resultados

**Como** administrador del sistema quiero validar que los resultados enviados sean consistentes con una prueba real para mantener la integridad del leaderboard y el historial de todos los usuarios.

- **ID:** GT-08.1
- **Prioridad:** Baja
- **Story Points:** 8
- **Tiempo estimado:** 2 días
- **Criterios de aceptación:**
  - El sistema verifica matemáticamente que el tiempo total, la cantidad de caracteres y el WPM reportado sean coherentes entre sí antes de persistir el dato.
  - Se rechazan o marcan automáticamente resultados que excedan límites físicos humanos razonables (ej. WPM sobrehumanos).
  - Los resultados rechazados no se publican en el leaderboard ni se suman al historial de mejores marcas.
  - El usuario recibe una notificación clara si su resultado no pudo ser validado por el sistema de integridad.

---

## Detalles Generales

- **ID:** GT-08
- **Tiempo estimado (total, incluye subtareas):** 4 días
- **Story Points (total, incluye subtareas):** 16
- **Prioridad:** Media

## Criterios de aceptación globales

- Se muestra una lista pública de usuarios ordenados por WPM (palabras por minuto).
- La tabla del ranking incluye el nombre del usuario, su récord de WPM y su porcentaje de precisión.
- Solo se incluyen en la lista resultados que hayan pasado satisfactoriamente los filtros de validación de la subtarea **GT-08.1**.
- La interfaz permite visualizar la posición actual del usuario autenticado dentro del ranking global.
