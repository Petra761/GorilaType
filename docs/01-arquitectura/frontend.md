# Arquitectura — Frontend

> Ubicación prevista en el repo: `docs/01-arquitectura/frontend.md`

## 1. Organización por feature/módulo

El frontend se organiza por feature/módulo, no por tipo de archivo. Cada feature agrupa todo lo que le pertenece (páginas, y a futuro componentes, hooks o lógica propios de esa feature). No se crean carpetas vacías de antemano — solo existen una vez que tienen contenido real.

```
frontend/src/
├── features/
│   ├── typing-test/
│   │   └── pages/
│   │       └── HomePage.tsx
│   ├── profile/
│   │   └── pages/
│   │       └── ProfilePage.tsx
│   ├── settings/
│   │   └── pages/
│   │       └── SettingsPage.tsx
│   ├── leaderboard/
│   │   └── pages/
│   │       └── LeaderboardPage.tsx
│   ├── auth/
│   │   └── pages/
│   │       ├── AuthPage.tsx           # login y registro en una misma página
│   │       ├── ForgotPasswordPage.tsx
│   │       └── ResetPasswordPage.tsx
│   ├── about/
│   │   └── pages/
│   │       └── AboutPage.tsx
│   └── not-found/
│       └── pages/
│           └── NotFoundPage.tsx
│
├── shared/                            # todo lo reutilizable entre features
│   ├── components/
│   │   └── layout/
│   │       └── MainLayout.tsx         # header + <Outlet /> para el contenido de cada página
│   ├── hooks/
│   └── utils/
│
└── routes/
    └── AppRouter.tsx                  # definición centralizada de todas las rutas
```

El detalle de nomenclatura y estándares de código para este stack está en [docs/03-estandares-de-codigo/frontend-react-ts.md](../03-estandares-de-codigo/frontend-react-ts.md).

## 2. Rutas

Se usa `react-router-dom`. Todas las rutas están definidas de forma centralizada en `routes/AppRouter.tsx`, anidadas dentro de `MainLayout` (así el layout se renderiza una sola vez y cada página aparece dentro de él vía `<Outlet />`).

| Ruta                    | Página             | Descripción                             |
| :---------------------- | :----------------- | :-------------------------------------- |
| `/`                     | HomePage           | Test de mecanografía                    |
| `/profile`              | ProfilePage        | Perfil del usuario                      |
| `/settings`             | SettingsPage       | Configuración                           |
| `/leaderboard`          | LeaderboardPage    | Ranking                                 |
| `/auth`                 | AuthPage           | Login y registro (misma página)         |
| `/auth/forgot-password` | ForgotPasswordPage | Solicitud de recuperación de contraseña |
| `/auth/reset-password`  | ResetPasswordPage  | Ingreso del código y nueva contraseña   |
| `/about`                | AboutPage          | Información del proyecto                |
| `*`                     | NotFoundPage       | Cualquier ruta no definida              |

## 3. Layout

`MainLayout` vive en `shared/components/layout/`, no dentro de un feature específico, ya que envuelve a toda la aplicación. Por ahora es mínimo (header con el nombre del proyecto); se irá completando con navegación y demás elementos comunes a medida que se necesiten.

## 4. Rutas protegidas

Todavía no implementadas. Proteger rutas depende de tener el estado de autenticación funcionando (JWT real), por lo que se aborda junto con la feature de `auth`, no antes.

## 5. Pendiente de definir

- Librería de testing específica (Vitest + Testing Library u otra) — ver `docs/03-estandares-de-codigo/frontend-react-ts.md`.
- Estrategia de rutas protegidas (guard/wrapper de ruta, redirección) — se define junto con la feature de `auth`.
