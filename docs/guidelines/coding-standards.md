# Coding Standards

> Define cómo se debe escribir código C# en GorilaType: convenciones de nombres, estilo y reglas para evitar warnings del compilador. Aplica a todo el código nuevo del proyecto.

**Última actualización:** 2026-08-13
**Última actualización:** 2026-09-04
**Autor(es):** Petra761

---

## 1. Convención general de nombres

| Elemento                         | Convención                 | Ejemplo                               |
| -------------------------------- | -------------------------- | ------------------------------------- |
| Clases                           | `PascalCase`               | `PlayerController`                    |
| Interfaces                       | `I` + `PascalCase`         | `IPlayerService`                      |
| Propiedades (atributos públicos) | `PascalCase`               | `PlayerName`                          |
| Métodos                          | `PascalCase`               | `CalculateScore()`                    |
| Campos privados                  | `_camelCase` (prefijo `_`) | `_playerName`                         |
| Variables locales                | `camelCase`                | `totalScore`                          |
| Parámetros de método             | `camelCase`                | `playerId`                            |
| Constantes                       | `PascalCase`               | `MaxPlayers`                          |
| Enums (tipo y valores)           | `PascalCase`               | `GameState { Idle, Running, Paused }` |
| Namespaces                       | `PascalCase`               | `GorilaType.Core`                     |

> ⚠️ **Nota:** el prefijo `_camelCase` para campos privados es la convención estándar de Microsoft, pero no la mencionaste explícitamente. Si el equipo prefiere otra (por ejemplo `camelCase` sin guion bajo), avisame y lo actualizo.

---

## 2. Interfaces

- Siempre empiezan con `I`.
- Le sigue el nombre en `PascalCase`, sin guiones bajos.
- El nombre debe ser un sustantivo o adjetivo que describa el contrato, no un verbo.

```csharp
public interface IPlayerService
{
    void SavePlayer(Player player);
}
```

```csharp
// ❌ Evitar
public interface iplayerservice { }
public interface Player_Service { }
```

---

## 3. Propiedades (atributos de clase)

- Siempre en `PascalCase`, sin importar si son públicas, protegidas o privadas.
- Usan `{ get; set; }` (o `{ get; }` si es de solo lectura) en vez de exponer campos directamente.

```csharp
public class Player
{
    public string Name { get; set; } = string.Empty;
    public int Score { get; set; } = 0;
    public bool IsActive { get; set; } = false;
}
```

---

## 4. Evitar warnings del compilador

El proyecto usa **nullable reference types** habilitado. El objetivo principal de este bloque es evitar warnings del compilador como `CS8618` (propiedad no nullable sin inicializar), sin que signifique una sobrecarga obligatoria para tipos por valor (primitivos como `int`, `double`, `bool`, etc., que ya cuentan con un valor por defecto no nulo y no generan warnings).

Guía para inicializadores:

| Tipo                             | Valor recomendado                   | Motivo / Contexto                                                                         |
| -------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `string` (requerido)             | `= null!;`                          | Evita `CS8618` delegando la asignación al ORM, mapeador o constructor.                    |
| `List<T>` / Colecciones          | `= new List<T>();`                  | Evita `NullReferenceException` al acceder a colecciones vacías.                           |
| Clases propias / Navegación (EF) | `= null!;` o `= new NombreClase();` | Evita `CS8618` en relaciones de navegación que EF Core inicializa en tiempo de ejecución. |
| `T?` (nullable explícito)        | (opcional, `= null;` no requerido)  | El modificador `?` explicita la intención de aceptar null y previene el warning.          |
| Primitivos (`int`, `bool`, etc.) | (opcional, `= 0;` no requerido)     | Al ser tipos por valor (value types), nunca son null y no generan `CS8618`.               |

```csharp
public class GameSession
{
    public string SessionId { get; set; } = null!;
    public List<Player> Players { get; set; } = new List<Player>();
    public int RoundNumber { get; set; }
    public Player? CurrentPlayer { get; set; }
}
```

---

## 5. Campos privados

- Prefijo `_` + `camelCase`.
- Se usan cuando se necesita lógica extra alrededor del valor (backing field de una propiedad), no como reemplazo de propiedades.

```csharp
private string _rawInput = string.Empty;
```

---

## 6. Métodos

- `PascalCase`, verbo que describe la acción.
- Un método hace una sola cosa. Si el nombre necesita "y" (`GuardarYNotificar`), probablemente debería dividirse en dos métodos.

```csharp
public void SavePlayer(Player player) { }
public bool TryLoadPlayer(string id, out Player player) { }
```

---

## 7. Constantes

- `PascalCase`, declaradas con `const` o `static readonly` según corresponda.

```csharp
public const int MaxPlayers = 4;
public static readonly string DefaultLanguage = "es";
```

---

## 8. Llaves y formato

- Llave `{` siempre en nueva línea (estilo Allman), consistente con el formato por defecto de Visual Studio / C#.

```csharp
public void CalculateScore()
{
    if (IsActive)
    {
        Score += 1;
    }
}
```

- Indentación: 4 espacios, no tabs.

---

## 9. Reglas generales

- No dejar código comentado en el commit final; si es necesario conservarlo temporalmente, usar `// TODO:` con una descripción clara.
- No usar `var` cuando el tipo no es obvio a simple vista; sí usarlo cuando el tipo ya es evidente por el lado derecho de la asignación (`var player = new Player();`).
- Evitar métodos y clases con más de una responsabilidad clara (principio de responsabilidad única).
- Todo warning del compilador debe resolverse antes de abrir el Pull Request, no silenciarse con `#pragma warning disable` salvo caso justificado y documentado en el propio código.

---

## 10. Ejemplo completo

```csharp
public interface IPlayerService
{
    void SavePlayer(Player player);
}

public class Player
{
    public string Name { get; set; } = string.Empty;
    public int Score { get; set; } = 0;
    public bool IsActive { get; set; } = false;

    private string _internalNote = string.Empty;

    public const int MaxScore = 9999;

    public void AddPoints(int points)
    {
        if (IsActive)
        {
            Score += points;
        }
    }
}
```

---

## 11. Arquitectura del backend (reglas rápidas)

Flujo completo y diagramas → [`docs/architecture/backend-architecture.md`](../architecture/backend-architecture.md). Acá solo las reglas obligatorias:

- Un `Controller` nunca accede a `AppDbContext` directo — siempre pasa por un `Service`.
- Un `Service` nunca arma queries de EF Core directo — siempre pasa por un `Repository`.
- Toda clase de `Services/` y `Repositories/` se registra en `Program.cs` contra su interfaz (`IPlayerService`, no `PlayerService`), inyectada por constructor.
- Ningún secreto (connection string, `Jwt:Key`) va en `appsettings.json` — siempre en `.env` (ver `appsettings.Example.json` como referencia de qué claves existen).
- Todo endpoint que requiera un usuario logueado lleva `[Authorize]`. Los públicos (login, registro) se marcan explícitamente con un comentario `// Público a propósito`.

---

## 12. Frontend (React + TypeScript)

> Convenciones de nombres de archivos/carpetas → [`docs/guidelines/naming-conventions.md`](./naming-conventions.md). Acá van las reglas de cómo se escribe el código en sí.

### 12.1 Componentes

- Siempre funcionales (no hay clases). Tipado explícito de props con `interface`, nunca `any`.
- Cada componente de `components/ui/` se crea como trío: `Componente.tsx` + `Componente.stories.tsx` + `Componente.test.tsx` — ningún componente nuevo se commitea sin sus tres archivos.

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", ...props }: ButtonProps) {
  // ...
}
```

### 12.2 Colores: siempre semánticos, nunca fijos

Un componente **nunca** usa un color literal de Tailwind (`bg-blue-600`, `text-gray-900`). Siempre usa las clases semánticas que mapean a la variable del tema activo:

```tsx
// ❌ Evitar — no cambia con el tema
<button className="bg-blue-600 text-white">

// ✅ Correcto — se adapta al tema activo
<button className="bg-primary text-background">
```

Colores disponibles: `background`, `background-alt`, `foreground`, `primary`, `muted`, `error`, `error-strong`. Cómo agregar un tema nuevo → [`docs/architecture/frontend-architecture.md`](../architecture/frontend-architecture.md).

### 12.3 Imports

- El alias `@/` para todo lo que esté dentro de `src/` (`@/components/...`, nunca `../../components/...`).
- Orden: librerías externas primero, luego internas (`@/...`), luego relativas (`./`) — con una línea en blanco entre cada grupo.

### 12.4 Hooks

- Un hook custom = un archivo en `src/hooks/`, nombre `useAlgo.ts`.
- Si el hook depende de un Context (como `useTheme`), debe lanzar un error explícito si se usa fuera de su Provider (ver `useTheme.ts` como referencia).

### 12.5 Iconografía

Toda la iconografía del proyecto está estandarizada bajo una única librería para garantizar coherencia visual en toda la aplicación:

- **Librería exclusiva:** Toda la iconografía del proyecto utiliza exclusivamente **Tabler Icons** a través del paquete oficial `@tabler/icons-react` para React.
- **Prohibición de SVGs manuales o generados:** Queda estrictamente prohibido dibujar SVGs de iconos a mano o generarlos mediante IA u otras herramientas externas.
- **Prohibición de mezclar librerías:** No se permite mezclar con otras librerías de iconos (`lucide-react`, `heroicons`, `react-icons`, etc.).
- **Motivo:** Mantener consistencia visual absoluta (mismo _stroke-width_, mismo grid de diseño base de 24×24) en toda la interfaz, optimizando el tiempo y recursos del equipo al evitar la creación artesanal de iconos con resultados dispares.
- **Uso y tamaños:**
  - Importación nombrada directa:
    ```tsx
    import { IconKeyboard, IconSettings } from "@tabler/icons-react";
    ```
  - **Tamaños estándar:**
    - **16px a 20px:** Para uso _inline_ junto a texto, botones compactos o inputs (ej. `size={18}`).
    - **24px:** Tamaño por defecto para acciones principales, barras de navegación o casos destacados (ej. `size={24}`).
