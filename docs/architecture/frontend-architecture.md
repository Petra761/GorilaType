# Arquitectura del frontend

> Cómo está organizado el frontend de GorilaType: carpetas, testing y sistema de temas.

**Última actualización:** 2026-08-13
**Autor(es):** Petra761

---

## 1. Estructura de carpetas

```
src/
├── components/
│ ├── ui/ → reutilizables (botones, inputs) — cada uno en su propia carpeta
│ └── layout/ → header, sidebar, wrappers de página
├── features/ → lógica agrupada por funcionalidad
├── hooks/
├── lib/ → clientes (Supabase, fetcher de API)
├── pages/ → una carpeta por página
├── routes/
│ └── index.tsx → todas las rutas, explícitas, en un solo lugar
├── services/ → llamadas a la API del backend
├── store/ → estado global (Contexts)
├── styles/
│ └── themes/ → un archivo CSS por tema
└── types/
```

No usamos rutas basadas en carpetas (a lo Next.js) a propósito — todas las rutas se definen explícitamente en `routes/index.tsx`, así queda un solo lugar donde ver el mapa completo de la app.

---

## 2. El alias `@/`

Todo import dentro de `src/` usa `@/` en vez de rutas relativas (`@/components/ui/Button/Button`, nunca `../../components/...`). Configurado en `vite.config.ts` (`resolve.alias`) y en `tsconfig.app.json` (`paths`, sin `baseUrl` — deprecado desde TypeScript 7).

---

## 3. Estrategia de testing

Dos herramientas, cada una para un propósito distinto:

- **Vitest + jsdom + Testing Library** (`npm run test`) — verifica que un componente se comporta bien (renderiza lo que debe, responde a eventos). Corre en un DOM simulado, rápido.
- **Storybook** (`npm run storybook`) — inspección visual manual: ver cómo se ve cada variante de un componente, aislado del resto de la app.

Cada componente de `components/ui/` se entrega en trío: `Componente.tsx` + `Componente.stories.tsx` + `Componente.test.tsx`.

> Nota: el addon `@storybook/addon-vitest`, que corre las stories como tests de navegador real (Chromium vía Playwright), quedó desactivado por un bug de compatibilidad con `aria-query` en este entorno. Si en una actualización futura de Storybook se resuelve, se puede reactivar agregando de nuevo el proyecto `storybookTest` en `vite.config.ts`.

---

## 4. Sistema de temas

Los temas se definen como bloques de variables CSS agrupadas bajo `[data-theme="nombre"]`, y Tailwind v4 las mapea a clases utilitarias vía `@theme inline` en `src/index.css`.

```css
/* src/styles/themes/nombre-del-tema.css */
[data-theme="nombre-del-tema"] {
  --background: #...;
  --background-alt: #...;
  --foreground: #...;
  --primary: #...;
  --muted: #...;
  --error: #...;
  --error-strong: #...;
}
```

Un componente nunca usa un color fijo de Tailwind (`bg-blue-600`) — siempre la clase semántica correspondiente (`bg-primary`), que cambia sola según el tema activo. Ver [`coding-standards.md §12.2`](../guidelines/coding-standards.md).

El estado del tema activo vive en `store/theme/ThemeContext.tsx` (expuesto vía el hook `useTheme`), y hoy es solo en memoria — no persiste entre sesiones (pendiente para más adelante).

**Para agregar un tema nuevo:**

1. Crear `src/styles/themes/nombre-tema.css` con las 7 variables del bloque de arriba.
2. Importarlo en `src/index.css`.
3. Agregar el nombre al tipo `ThemeName` en `ThemeContext.tsx`.
