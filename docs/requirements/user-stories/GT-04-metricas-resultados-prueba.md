# GT-04 – Métricas y Resultados de la Prueba

> Cálculo, visualización y persistencia de métricas y resultados de cada prueba.

**Última actualización:** 2026-08-04
**Autor(es):** Marcelo Llanos

---

## Historia

**Como** usuario  
**Quiero** ver y conservar mis métricas y resultados  
**Para** conocer y hacer seguimiento de mi rendimiento

---

## Detalles de Subtareas

### GT-04.1 – Visualización de Resultados

**Como** usuario quiero ver mis resultados al finalizar para analizar mi rendimiento.

- **ID:** GT-04.1
- **Prioridad:** Alta
- **Story Points:** 3
- **Tiempo estimado:** 1 día
- **Criterios de aceptación:**
  - Se muestran claramente las WPM (Palabras por minuto), la precisión (%) y el tiempo transcurrido.
  - Los resultados aparecen inmediatamente al concluir la prueba.
  - La información se presenta de forma visualmente clara y legible.

---

### GT-04.2 – Registro de Resultados

**Como** usuario quiero que mis resultados se guarden para mantener un historial de mis pruebas.

- **ID:** GT-04.2
- **Prioridad:** Alta
- **Story Points:** 5
- **Tiempo estimado:** 1 día
- **Criterios de aceptación:**
  - Se guardan los valores de WPM, precisión y la fecha/hora de la prueba.
  - Los datos se almacenan correctamente en la base de datos vinculada al usuario.
  - No se pierden los datos tras recargar la página o cerrar sesión.

---

### GT-04.3 – Historial de Pruebas

**Como** usuario quiero ver mis pruebas anteriores para hacer seguimiento de mi progreso.

- **ID:** GT-04.3
- **Prioridad:** Media
- **Story Points:** 5
- **Tiempo estimado:** 2 días
- **Criterios de aceptación:**
  - Se despliega una lista de todas las pruebas realizadas anteriormente.
  - Se muestran las métricas principales por cada prueba listada.
  - Los datos se presentan ordenados cronológicamente (de más reciente a más antiguo).

---

### GT-04.4 – Mejor Resultado

**Como** usuario quiero que se guarde mi mejor puntaje para ver mi progreso máximo.

- **ID:** GT-04.4
- **Prioridad:** Media
- **Story Points:** 3
- **Tiempo estimado:** 1 día
- **Criterios de aceptación:**
  - El sistema identifica automáticamente el resultado con mayores WPM.
  - Se guarda y actualiza el "Personal Best" automáticamente.
  - El mejor resultado histórico se muestra de forma destacada en el perfil del usuario.

---

## Detalles Generales

- **ID:** GT-04
- **Tiempo estimado (total, incluye subtareas):** 8.5 días
- **Story Points (total, incluye subtareas):** 21
- **Prioridad:** Alta

## Criterios de aceptación globales

- El sistema calcula WPM y precisión correctamente basándose en los caracteres correctos/incorrectos y el tiempo empleado.
- Las métricas se muestran en tiempo real durante la ejecución de la prueba.
- Se cumplen satisfactoriamente todos los criterios de aceptación de las subtareas **GT-04.1** a **GT-04.4**.
