# Estándares de Código — Frontend (React + TypeScript)

> Ubicación prevista en el repo: `docs/03-estandares-de-codigo/frontend-react-ts.md`

## 1. Stack

- React 19.x
- TypeScript 6.x
- Vite 8.x
- Tailwind CSS 4.x

## 2. Formateo y linting

- **ESLint** + **Prettier**, con configuración por defecto salvo que se documente una excepción específica.

## 3. Nomenclatura

| Elemento                        | Convención                  | Ejemplo                     |
| :------------------------------ | :-------------------------- | :-------------------------- |
| Componentes (archivo y función) | PascalCase                  | `TestResultCard.tsx`        |
| Hooks propios                   | camelCase con prefijo `use` | `useTypingTest.ts`          |
| Variables y funciones           | camelCase                   | `calculateWpm()`            |
| Tipos e interfaces              | PascalCase                  | `TestResult`, `UserProfile` |

Los nombres se escriben en **inglés**; los comentarios se escriben en **español**.

## 4. Gestión de estado

No hay una librería de estado global fija decidida de antemano: se define según la necesidad de cada módulo (por ejemplo, Context API para estado simple compartido, o una librería dedicada si un módulo lo justifica — como el estado en tiempo real de una partida PvP más adelante).

## 5. Estilos

Tailwind CSS, siguiendo el design system propio de GorilaType (colores, tipografía y tokens definidos en `docs/01-arquitectura/`), que además debe soportar la personalización de temas del usuario (colores, tipografía, sonidos, caret) definida como requisito del MVP.

## 6. Testing

Se escriben tests automatizados para los componentes del frontend.

## 7. CI

La ejecución de linters/analizadores automáticos en CI (GitHub Actions) queda para una fase posterior al MVP inicial.

## 8. Pendiente de definir

- Librería de testing específica (ej. Vitest + Testing Library) — a confirmar cuando se arranque el proyecto.
- Convención de organización de carpetas dentro de `src/` (por feature vs. por tipo) — a definir junto con `docs/01-arquitectura/frontend.md`.
