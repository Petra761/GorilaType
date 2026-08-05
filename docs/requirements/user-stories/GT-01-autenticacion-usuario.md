# GT-01 – Autenticación de Usuario

> Registro, inicio de sesión y gestión del ciclo de vida de la sesión del usuario.

**Última actualización:** 2026-08-04
**Autor(es):** Marcelo Llanos

---

## Historia

**Como** usuario  
**Quiero** registrarme e iniciar sesión en la plataforma de forma segura  
**Para** acceder a mis pruebas y resultados

---

## Detalles de Subtareas

### GT-01.1 – Persistencia de Sesión

**Como** usuario quiero mantener mi sesión iniciada para no tener que iniciar sesión constantemente.

- **ID:** GT-01.1
- **Prioridad:** Media
- **Story Points:** 3
- **Tiempo estimado:** 1 día
- **Criterios de aceptación:**
  - La sesión se mantiene tras recargar.
  - Se cierra correctamente al salir.
  - No se pierde información del usuario.

---

### GT-01.2 – Autenticación con OAuth

**Como** usuario quiero iniciar sesión con Google o GitHub para acceder más rápido.

- **ID:** GT-01.2
- **Prioridad:** Baja
- **Story Points:** 8
- **Tiempo estimado:** 2 días
- **Criterios de aceptación:**
  - El usuario puede iniciar sesión con proveedores externos.
  - Se crea cuenta automáticamente si no existe.
  - Se vincula correctamente con el usuario.

---

### GT-01.3 – Recuperación de Contraseña

**Como** usuario quiero poder restablecer mi contraseña si la olvido para recuperar el acceso a mi cuenta sin depender de soporte.

- **ID:** GT-01.3
- **Prioridad:** Alta
- **Story Points:** 5
- **Tiempo estimado:** 1.5 días
- **Criterios de aceptación:**
  - El usuario puede solicitar recuperación ingresando su correo.
  - Se envía un enlace o código de restablecimiento al correo registrado.
  - El enlace/código expira después de un tiempo definido.
  - El usuario puede definir una nueva contraseña válida y volver a iniciar sesión.

---

### GT-01.4 – Cierre de Sesión

**Como** usuario quiero cerrar sesión de forma explícita para proteger mi cuenta cuando uso un dispositivo compartido.

- **ID:** GT-01.4
- **Prioridad:** Alta
- **Story Points:** 2
- **Tiempo estimado:** 0.5 días
- **Criterios de aceptación:**
  - Existe una opción visible de "Cerrar sesión".
  - Al cerrar sesión se invalida el token/sesión activa.
  - El usuario es redirigido a la pantalla de inicio de sesión.
  - No queda información de sesión accesible tras el cierre.

---

## Detalles Generales

- **ID:** GT-01
- **Tiempo estimado (total, incluye subtareas):** 7 días
- **Story Points (total, incluye subtareas):** 23
- **Prioridad:** Alta

## Criterios de aceptación globales

- El usuario puede registrarse con correo y contraseña.
- El sistema valida credenciales correctamente.
- El usuario puede iniciar sesión sin errores.
- Se muestra mensaje en caso de credenciales inválidas.
- Se deben cumplir satisfactoriamente los criterios de aceptación de las subtareas **GT-01.1** a **GT-01.4**.
