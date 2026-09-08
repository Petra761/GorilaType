# Frontend Auth Spec

> Especificación funcional y técnica del módulo de autenticación del frontend de GorilaType: rutas, flujos de pantalla y contrato de la API que debe consumir. Para uso de cualquier desarrollador o IA que construya los componentes visuales de este módulo.

**Última actualización:** 2026-09-07
**Autor(es):** Petra761

---

## 1. Contexto

GorilaType es una app de test de mecanografía construida como ejercicio de aprendizaje de buenas prácticas profesionales. El backend del módulo de autenticación (GT-01) está completo y documentado en [`authentication.md`](./authentication.md). Este documento especifica cómo el frontend debe consumirlo.

---

## 2. Stack tecnológico

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router v8
- Zustand (estado global de sesión)
- Vitest 4 + Testing Library
- `@tabler/icons-react` (única librería de íconos permitida)

### 2.1 Convención de componentes

Cada componente vive en su propia carpeta con exactamente 2 archivos:

```
ComponentName/
├── ComponentName.tsx
└── ComponentName.test.tsx
```

No se usa Storybook en este proyecto.

### 2.2 Sistema de temas

Ya implementado, no forma parte del alcance de este documento. Usa las variables CSS del tema activo (`[data-theme][data-mode]`, definidas vía `@theme` de Tailwind v4); nunca colores hardcodeados.

---

## 3. Estructura de rutas

| Ruta                       | Acceso          | Descripción                                       |
| -------------------------- | --------------- | ------------------------------------------------- |
| `/`                        | Público         | Home / test de mecanografía                       |
| `/auth`                    | Solo invitados  | Login + registro (un solo path)                   |
| `/auth/callback/:provider` | Público         | Callback de OAuth (`google`, `github`, `discord`) |
| `/profile`                 | Requiere sesión | Perfil del usuario                                |
| `/settings`                | Requiere sesión | Configuraciones                                   |
| `/leaderboard`             | Público         | Ranking                                           |
| `/about`                   | Público         | About us                                          |
| `*`                        | Público         | Not Found                                         |

Las notificaciones no tienen ruta propia: son un modal global, disparado desde un ícono en el layout persistente.

### 3.1 Guardas de ruta

- `RequireAuth`: redirige a `/auth` si no hay sesión activa.
- `GuestOnly`: redirige a `/` si ya hay sesión activa (aplica a `/auth`).

Ambas ya están implementadas en `src/routes/`.

---

## 4. Cliente HTTP

Ya implementado en `src/services/api.ts`. Responsabilidades:

1. Base URL desde `VITE_API_BASE_URL`.
2. `credentials: 'include'` en toda request, para que la cookie httpOnly del refresh token viaje correctamente.
3. Header `Authorization: Bearer <accessToken>` adjuntado automáticamente.
4. Ante un `401`, intenta `POST /auth/refresh` automáticamente y reintenta la request original una vez; si el refresh también falla, limpia la sesión.

---

## 5. Flujo de autenticación — pantalla `/auth`

### 5.1 Diseño de interacción

Un único componente contiene los formularios de login y registro superpuestos. Al alternar entre ellos, una transición anima un panel que cubre el formulario activo y revela el otro — sin cambiar de URL, con estado local de "modo actual".

### 5.2 Login

Campos: `email`, `password`. Envía `POST /auth/login`.

- Éxito (200): guarda la sesión, redirige a `/`.
- Error (401): mensaje genérico del backend (`"Credenciales inválidas."`).

Incluye un enlace a la recuperación de contraseña (sección 5.5).

### 5.3 Registro

Campos: `username`, `email`, `password`. Envía `POST /auth/register`.

Reglas de validación de formato (ya implementadas en `src/lib/validators/auth.ts`):

- `username`: 3 a 50 caracteres.
- `email`: formato de correo válido.
- `password`: mínimo 8 caracteres.

- Éxito (200): igual que login.
- Error (409): mensaje del backend indicando correo o username duplicado.

### 5.4 Botones de OAuth

Tres botones (Google, GitHub, Discord). Al hacer clic, se llama a `redirectToOAuthProvider(provider)` (ya implementado en `src/lib/oauth.ts`), que navega el navegador completo hacia el proveedor correspondiente.

### 5.5 Página de callback OAuth (`/auth/callback/:provider`)

La lógica de esta pantalla ya está resuelta por el hook `useOAuthCallback` (`src/hooks/useOAuthCallback.ts`). Expone un estado con 4 posibles valores:

| Estado              | Comportamiento esperado en la UI                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading`           | Mostrar indicador de carga.                                                                                                                                                     |
| `success`           | Transitorio; el hook ya redirige a `/` automáticamente.                                                                                                                         |
| `username_required` | Mostrar selector de username: input libre + `suggestedUsernames` como opciones rápidas. Al confirmar, llamar a `useCompleteOAuthRegistration().submit(pendingToken, username)`. |
| `error`             | Mostrar `errorMessage` devuelto por el hook.                                                                                                                                    |

### 5.6 Recuperación de contraseña

Dos pantallas o pasos dentro del mismo flujo:

1. **Solicitar código:** campo `email`, usa `useForgotPassword` (`src/hooks/useForgotPassword.ts`). Muestra siempre el `successMessage` devuelto, sin importar si el correo existía.
2. **Restablecer con código:** campos `email`, `code` (6 dígitos), `newPassword`, usa `useResetPassword` (`src/hooks/useResetPassword.ts`). Al tener éxito, el hook navega a `/auth` con un estado de navegación (`location.state.passwordResetSuccess`) para mostrar confirmación ahí.

---

## 6. Estado de sesión (Zustand)

Ya implementado en `src/store/authStore.ts`. Forma:

```ts
interface AuthState {
  user: {
    id: string;
    username: string;
    profilePictureUrl: string | null;
  } | null;
  accessToken: string | null;
  isInitializing: boolean;
}
```

El refresh token nunca vive en este store — vive exclusivamente en la cookie httpOnly. `isInitializing` permanece en `true` mientras la app intenta restaurar sesión silenciosamente al cargar (`useAppInit`, ya integrado en `App.tsx`).

---

## 7. Contrato de la API

Ver [`authentication.md`](./authentication.md) para el detalle completo de cada endpoint y sus decisiones de seguridad. Resumen de las funciones ya disponibles en `src/services/auth.service.ts`:

| Función                     | Endpoint                                 | Uso                    |
| --------------------------- | ---------------------------------------- | ---------------------- |
| `register`                  | `POST /auth/register`                    | Registro tradicional   |
| `login`                     | `POST /auth/login`                       | Login tradicional      |
| `logout`                    | `POST /auth/logout`                      | Cierre de sesión       |
| `forgotPassword`            | `POST /auth/forgot-password`             | Solicitar código       |
| `resetPassword`             | `POST /auth/reset-password`              | Restablecer contraseña |
| `loginWithOAuth`            | `POST /auth/oauth/{provider}`            | Login/registro OAuth   |
| `completeOAuthRegistration` | `POST /auth/oauth/complete-registration` | Segundo paso de OAuth  |

> [!IMPORTANT]
> Los endpoints de OAuth están implementados en el backend pero no verificados end-to-end todavía. La primera integración real con el frontend es también la primera prueba funcional completa de ese flujo.

---

## 8. Variables de entorno

Definidas en `frontend/.env.example`:

```dotenv
VITE_API_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_GITHUB_CLIENT_ID=
VITE_DISCORD_CLIENT_ID=
```

---

## 9. Fuera de alcance

No se detalla en este documento: diseño visual definitivo (colores, layout exacto), contenido de `/profile`, `/settings`, `/leaderboard`, `/about`, ni el diseño del modal de notificaciones más allá de "es un modal global".
