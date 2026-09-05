# Arquitectura del frontend

> Cómo está organizado el frontend de GorilaType: carpetas, testing y sistema de temas.

**Última actualización:** 2026-09-04
**Autor(es):** Petra761

---

## 1. Estructura de carpetas

```
src/
├── components/
│   ├── ui/        → reutilizables (botones, inputs) — cada uno en su propia carpeta
│   └── layout/    → header, sidebar, wrappers de página
├── features/      → lógica agrupada por funcionalidad
├── hooks/
├── lib/
│   └── themes/    → catálogo, tipos y ThemeProvider
├── pages/         → una carpeta por página
├── routes/
│   └── index.tsx  → todas las rutas, explícitas, en un solo lugar
├── services/      → llamadas a la API del backend
├── store/         → estado global (Contexts)
├── styles/
│   ├── themes/    → un archivo CSS por tema
│   └── themes.css → definición @theme de Tailwind v4 y tema por defecto
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

### 4.1. Descripción general

GorilaType soporta múltiples paletas de color (temas), cada una con hasta dos variantes de modo (`dark` / `light`). El tema activo se aplica mediante atributos `data-theme` y `data-mode` en el elemento raíz `<html>`. Los valores de color reales se resuelven mediante CSS custom properties condicionadas por la combinación de esos dos atributos.

- **Tema por defecto:** `malachite` (`dark`).

### 4.2. Fuente de verdad del catálogo

El catálogo vive en `src/lib/themes/types.ts` y exporta `THEME_CATALOG` (un arreglo de `ThemeDefinition`). Cada tema declara:
- `id`: identificador único en kebab-case.
- `label`: nombre visible en la UI.
- `variants`: modos que soporta (`variants: { dark?: true, light?: true }`).

Un tema puede declarar una sola variante (por ejemplo, solo `dark`). En ese caso, la UI no muestra el botón de alternar claro/oscuro (evaluado mediante `themeSupportsToggle` en `types.ts`).

### 4.3. Tokens de color y Tailwind v4

Los tokens semánticos se configuran con la directiva `@theme` de Tailwind v4 en `src/styles/themes.css`. Este bloque mapea utilidades semánticas a variables CSS libres:

```css
@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-success: var(--success);
  --color-danger: var(--danger);
}
```

- Los componentes nunca usan colores fijos de Tailwind (evitar `bg-blue-600`); siempre usan clases semánticas (`bg-surface`, `text-text-primary`, `bg-accent`).
- El valor real de cada variable lo fija el bloque `[data-theme="<id>"][data-mode="<modo>"]` activo.
- Cada tema vive en su propio archivo dentro de `src/styles/themes/<id>.css` y se importa en `src/styles/themes.css`.
- **Excepción:** `malachite`, al ser el tema base por defecto, define sus selectores directamente en `src/styles/themes.css` junto al bloque `@theme`.

### 4.4. Provider y persistencia

El estado del tema se gestiona mediante `src/lib/themes/ThemeProvider.tsx`, el cual expone el hook `useTheme()` con las siguientes propiedades:
- `themeId`: id del tema activo.
- `mode`: variante activa (`dark` o `light`).
- `setThemeId(id)`: cambia el tema actual.
- `toggleMode()`: alterna entre `dark` y `light` (si el tema lo permite).
- `canToggleMode`: `boolean` que indica si el tema actual soporta alternar entre variantes.

**Persistencia y resolución:**
1. Persiste por separado en `localStorage` el ID del tema (`gorilatype:theme-id`) y la preferencia de modo (`gorilatype:mode`).
2. Resuelve el modo real contra las variantes soportadas por el tema activo: si el tema no soporta el modo preferido, cae automáticamente a la única variante disponible sin sobrescribir la preferencia global del usuario.
3. Sincroniza los atributos `data-theme` y `data-mode` en `document.documentElement` (`<html>`).

### 4.5. Prevención de parpadeo (Anti-flash)

Para evitar el parpadeo en blanco al cargar la página (FOUC), `index.html` incluye un script inline que lee `localStorage` y aplica `data-theme` y `data-mode` en `<html>` antes del primer render de React.

Este script utiliza el catálogo de variantes inyectado en build time por el plugin de Vite (`vite-plugins/theme-catalog-plugin.ts`), leyendo directamente `THEME_CATALOG` desde `src/lib/themes/types.ts` para no duplicar información manualmente.

### 4.6. Guía: Cómo agregar un tema nuevo

Para incorporar un nuevo tema a GorilaType, seguir estos pasos en orden:

1. **Registrar en el catálogo:** Agregar la entrada en `THEME_CATALOG` (`src/lib/themes/types.ts`) con su `id`, `label` y `variants` soportadas (`dark`, `light` o ambas).
2. **Crear las variables CSS:** Crear el archivo `src/styles/themes/<id>.css` definiendo los bloques `[data-theme="<id>"][data-mode="dark"]` y/o `[data-theme="<id>"][data-mode="light"]` según corresponda. Debe incluir todas las variables requeridas por el `@theme`:
   - `--bg`
   - `--surface`
   - `--surface-elevated`
   - `--text-primary`
   - `--text-secondary`
   - `--border`
   - `--accent`
   - `--accent-hover`
   - `--success`
   - `--danger`
3. **Importar el CSS:** Importar el archivo nuevo dentro de `src/styles/themes.css`.
4. **Listo:** No es necesario modificar `index.html` ni `vite-plugins/theme-catalog-plugin.ts`, ya que leen `THEME_CATALOG` de manera automática durante el build.
