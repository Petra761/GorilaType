# GT-02 – Ejecución de la Prueba de Mecanografía

> Flujo completo de una prueba de escritura: captura de teclado, validación, retroalimentación y cierre.

**Última actualización:** 2026-08-04
**Autor(es):** Marcelo Llanos

---

## Historia

**Como** usuario  
**Quiero** realizar una prueba de escritura completa e interactiva  
**Para** medir mi velocidad y precisión en tiempo real

---

## Detalles de Subtareas

### GT-02.1 – Captura de Teclado en Tiempo Real

**Como** usuario quiero que el sistema detecte mis teclas en tiempo real para que la prueba sea precisa.

- **ID:** GT-02.1 -
- **Prioridad:** Alta
- **Story Points:** 8
- **Tiempo:** 2 días
- **Criterios de aceptación:**
  - Cada tecla presionada es registrada inmediatamente.
  - No existe retraso perceptible en la captura.
  - Se ignoran teclas no válidas (teclas de función, etc.).

---

### GT-02.2 – Validación de Caracteres

**Como** usuario quiero que el sistema valide lo que escribo para saber si estoy cometiendo errores.

- **ID:** GT-02.2
- **Prioridad:** Alta
- **Story Points:** 5 -
- **Tiempo:** 1.5 días
- **Criterios de aceptación:**
  - Cada carácter ingresado se valida contra el texto original.
  - Se detectan errores en tiempo real.
  - Se diferencian correctamente caracteres correctos e incorrectos.

---

### GT-02.3 – Retroalimentación Visual

**Como** usuario quiero ver qué escribo correctamente o incorrectamente para mejorar mi desempeño.

- **ID:** GT-02.3
- **Prioridad:** Alta
- **Story Points:** 5
- **Tiempo:** 1 día
- **Criterios de aceptación:**
  - Caracteres correctos se muestran en un color (ej. verde).
  - Caracteres incorrectos se muestran en otro color (ej. rojo).
  - La actualización visual es instantánea.

---

### GT-02.4 – Cursor Dinámico

**Como** usuario quiero que el cursor avance automáticamente para seguir el flujo de escritura.

- **ID:** GT-02.4
- **Prioridad:** Alta
- **Story Points:** 3
- **Tiempo:** 1 día
- **Criterios de aceptación:**
  - El cursor se mueve al siguiente carácter automáticamente tras pulsar una tecla.
  - El usuario no puede saltar posiciones manualmente con el ratón.
  - El cursor visual coincide exactamente con la posición lógica de escritura.

---

### GT-02.5 – Indicador de Palabra Actual

**Como** usuario quiero ver la palabra actual resaltada para enfocarme mejor en lo que escribo.

- **ID:** GT-02.5
- **Prioridad:** Media
- **Story Points:** 2
- **Tiempo:** 0.5 días
- **Criterios de aceptación:**
  - La palabra actual (hasta el siguiente espacio) se resalta visualmente.
  - El resaltado cambia automáticamente al avanzar a la siguiente palabra.
  - Solo una palabra está activa/resaltada a la vez.

---

### GT-02.6 – Control del Tiempo

**Como** usuario quiero ver y controlar el tiempo de la prueba para completar el ejercicio correctamente.

- **ID:** GT-02.6
- **Prioridad:** Alta
- **Story Points:** 3 -
- **Tiempo:** 1 día
- **Criterios de aceptación:**
  - El temporizador inicia automáticamente al presionar la primera tecla.
  - La prueba termina forzosamente al llegar a 0.
  - El tiempo restante se muestra de forma clara al usuario.

---

### GT-02.7 – Corrección con Backspace

**Como** usuario quiero usar backspace para corregir errores para mejorar mi resultado.

- **ID:** GT-02.7
- **Prioridad:** Media
- **Story Points:** 3
- **Tiempo:** 1 día
- **Criterios de aceptación:**
  - El usuario puede borrar caracteres escritos.
  - El sistema actualiza el estado de validación y la posición del cursor al borrar.
  - No se generan errores lógicos al retroceder entre palabras (si está permitido).

---

### GT-02.8 – Finalización Automática

**Como** usuario quiero que la prueba finalice automáticamente para ver mis resultados sin intervención manual.

- **ID:** GT-02.8
- **Prioridad:** Alta
- **Story Points:** 3
- **Tiempo:** 1 día
- **Criterios de aceptación:**
  - La prueba finaliza al agotar el tiempo o completar el texto.
  - Se bloquea cualquier entrada adicional de teclado al finalizar.
  - Se disparan los eventos para mostrar los resultados inmediatamente.

---

### GT-02.9 – Reinicio Rápido

**Como** usuario quiero reiniciar la prueba fácilmente para volver a intentarlo rápidamente.

- **ID:** GT-02.9
- **Prioridad:** Media
- **Story Points:** 2
- **Tiempo:** 0.5 días
- **Criterios de aceptación:**
  - Existe un botón o atajo de teclado para reiniciar.
  - La prueba se limpia y reinicia todos los contadores sin errores.
  - Se carga un nuevo set de palabras o se reinicia el texto actual.

---

## Detalles Generales

- **ID:** GT-02
- **Tiempo estimado (total):** 14.5 días
- **Story Points (total):** 42
- **Prioridad:** Alta

## Criterios de aceptación globales

- El usuario puede iniciar una prueba y se muestra un texto a escribir de forma legible.
- La prueba comienza exactamente al presionar la primera tecla válida.
- Se registran todos los eventos de teclado para el cálculo posterior de métricas.
- Se cumplen íntegramente los criterios definidos en las subtareas **GT-02.1** a **GT-02.9**.
