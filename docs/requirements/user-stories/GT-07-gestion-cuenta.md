# GT-07 – Gestión de Cuenta

> Edición de datos básicos, personalización visual y eliminación de la cuenta del usuario.

**Última actualización:** 2026-08-04
**Autor(es):** Jmarcelo

---

## Historia

**Como** usuario  
**Quiero** administrar los datos y preferencias de mi cuenta  
**Para** personalizarla y mantener control sobre mi información

---

## Detalles de Subtareas

### GT-07.1 – Tema Visual

**Como** usuario quiero cambiar el tema de la interfaz para mejorar la experiencia visual.

- **ID:** GT-07.1
- **Prioridad:** Baja
- **Story Points:** 3
- **Tiempo estimado:** 1 día
- **Criterios de aceptación:**
  - El usuario puede elegir entre modo claro (light) y modo oscuro (dark).
  - El cambio de tema se aplica inmediatamente a toda la interfaz sin necesidad de recargar.
  - La preferencia del tema se guarda en el perfil del usuario o almacenamiento local para futuras sesiones.

---

### GT-07.2 – Eliminación de Cuenta

**Como** usuario quiero poder eliminar mi cuenta y mis datos para ejercer control sobre mi información personal.

- **ID:** GT-07.2
- **Prioridad:** Baja
- **Story Points:** 5
- **Tiempo estimado:** 1.5 días
- **Criterios de aceptación:**
  - El usuario dispone de una opción clara para solicitar la eliminación de su cuenta en la configuración.
  - El sistema solicita una confirmación explícita (ej. reintroducir contraseña o mensaje de advertencia) antes de proceder.
  - Al confirmar, se eliminan o anonimizan de forma permanente los datos personales y el historial de pruebas.
  - El acceso a la cuenta queda revocado inmediatamente y no es posible volver a iniciar sesión.

---

## Detalles Generales

- **ID:** GT-07
- **Tiempo estimado (total, incluye subtareas):** 4 días
- **Story Points (total, incluye subtareas):** 13
- **Prioridad:** Baja

## Criterios de aceptación globales

- El usuario puede editar sus datos básicos (nombre de usuario o correo electrónico) y los cambios persisten correctamente.
- Se validan los datos ingresados (formato de correo válido, campos no vacíos).
- El sistema informa mediante notificaciones cuando los cambios de perfil se han guardado con éxito.
- Se cumplen satisfactoriamente los criterios específicos de las subtareas **GT-07.1** y **GT-07.2**.
