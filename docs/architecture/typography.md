# Sistema de tipografía

**Última actualización:** 2026-09-07
**Autor(es):** Petra761

## Resumen

GorilaType permite personalizar la tipografía en dos niveles independientes:

- **Fuente de UI (`--font-ui`)**: fija, definida por el desarrollador. No es seleccionable por el usuario. Aplica a toda la interfaz excepto el área de tipeo.
- **Fuente de tipeo (`--font-typing`)**: seleccionable por el usuario, persistida en `localStorage`. Aplica únicamente al área donde el usuario escribe durante el test.

Esta separación existe porque el área de tipeo requiere fuentes monoespaciadas (ancho de carácter constante) para que el cursor y el layout no salten mientras se escribe, mientras que la UI general no tiene esa restricción.

## Arquitectura

El sistema replica el patrón ya usado para temas (`ThemeProvider`, `THEME_CATALOG`, script anti-flash), aplicado a fuentes:

| Pieza                   | Ubicación                                      | Rol                                                                                                             |
| ----------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Catálogo                | `src/lib/fonts/types.ts`                       | Single source of truth: id, label, family, pesos disponibles                                                    |
| Declaraciones de fuente | `src/styles/fonts.css`                         | `@font-face` por fuente/peso + mapeo `[data-typing-font="id"]` → `--font-typing`                                |
| Provider                | `src/lib/fonts/FontProvider.tsx`               | Contexto React, persistencia en `localStorage`, aplica el atributo `data-typing-font`                           |
| Selector UI             | `src/components/FontSwitcher.tsx`              | Dropdown para elegir la fuente de tipeo                                                                         |
| Plugin Vite             | `frontend/vite-plugins/font-catalog-plugin.ts` | Extrae los ids del catálogo en build time e inyecta el JSON en `index.html`                                     |
| Script anti-flash       | `frontend/index.html` (inline)                 | Aplica `data-typing-font` desde `localStorage` antes del primer render, evitando el flash de fuente por defecto |

## Carga de fuentes: self-hosted

Todas las fuentes (tanto de UI como de tipeo) se sirven como archivos `.woff2` propios en `public/fonts/{id}/{peso}.woff2`, declarados vía `@font-face`. Se descartó Google Fonts (CDN) para no depender de un tercero externo, mantener el proyecto funcional offline, y ser consistente con el resto del stack (todo versionado en el repo).

## Catálogo actual de fuentes de tipeo

Monoespaciadas, licencia OFL: JetBrains Mono, Fira Code, IBM Plex Mono, Space Mono, Roboto Mono, Source Code Pro, Cascadia Code, Chakra Petch.

Fuente de UI: Inter.

## Cómo agregar una fuente nueva

1. Descargar los `.woff2` de los pesos necesarios (fuente OFL o licencia equivalente).
2. Guardar en `public/fonts/{id}/{peso}.woff2`.
3. Agregar un bloque `@font-face` por peso en `fonts.css`.
4. Agregar la regla `[data-typing-font="{id}"] { --font-typing: '{family}', monospace; }` en `fonts.css` (solo si es fuente de tipeo).
5. Registrar la entrada en `FONT_CATALOG` (`src/lib/fonts/types.ts`).

No se requiere tocar el `FontProvider`, el plugin, el script anti-flash, ni el `FontSwitcher` — todos leen del catálogo dinámicamente.

## Notas

- `font-display: swap` se usa por defecto. Si el salto de ancho durante la carga resulta molesto en el área de tipeo, evaluar `font-display: optional` para esa fuente específica.
- El script anti-flash duplica en JS plano parte de la lógica de validación del `FontProvider`, porque corre antes de que React exista y no puede importar el módulo TS. Es el mismo patrón ya usado para temas.
