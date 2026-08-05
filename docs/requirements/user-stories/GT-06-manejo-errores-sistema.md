# GT-06 – Manejo de Errores del Sistema

> Mensajes de error comprensibles y manejo de fallas de conexión en la plataforma.

**Última actualización:** 2026-08-04
**Autor(es):** Marcelo Llanos

---

## Historia

**Como** usuario  
**Quiero** recibir mensajes de error claros ante cualquier falla  
**Para** entender qué ocurrió y no perder mi progreso

---

## Detalles de Subtareas

### GT-06.1 – Manejo de Errores de Conexión

**Como** usuario quiero recibir aviso claro cuando pierdo conexión para no perder mis resultados ni quedar confundido sobre el estado de la prueba.

- **ID:** GT-06.1
- **Prioridad:** Media
- **Story Points:** 5
- **Tiempo estimado:** 1.5 días
- **Criterios de aceptación:**
  - Se muestra un mensaje de alerta visible e intuitivo cuando se detecta pérdida de conexión.
  - Si falla el guardado de un resultado en el servidor, el sistema realiza reintentos automáticos o informa al usuario para que intente manualmente.
  - El usuario puede continuar la escritura de forma local aunque la conexión falle momentáneamente (el contador y la validación deben seguir funcionando).
  - No se pierden los datos de resultados de pruebas ya finalizadas por errores temporales de red; se asegura la persistencia una vez recuperada la conexión.

---

## Detalles Generales

- **ID:** GT-06
- **Tiempo estimado (total, incluye subtareas):** 2.5 días
- **Story Points (total, incluye subtareas):** 8
- **Prioridad:** Media

## Criterios de aceptación globales

- Los errores del sistema muestran mensajes claros en lenguaje sencillo, indicando la posible solución o acción a seguir.
- Se ocultan errores técnicos complejos (logs de base de datos o código interno) al usuario final para evitar confusión.
- El sistema es capaz de manejar excepciones críticas sin interrumpir abruptamente la experiencia del usuario.
- Se cumplen satisfactoriamente los criterios detallados en la subtarea **GT-06.1**.
