# Coding Standards

> Define cómo se debe escribir código C# en GorilaType: convenciones de nombres, estilo y reglas para evitar warnings del compilador. Aplica a todo el código nuevo del proyecto.

**Última actualización:** 2026-07-16
**Autor(es):** Equipo GorilaType

---

## 1. Convención general de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases | `PascalCase` | `PlayerController` |
| Interfaces | `I` + `PascalCase` | `IPlayerService` |
| Propiedades (atributos públicos) | `PascalCase` | `PlayerName` |
| Métodos | `PascalCase` | `CalculateScore()` |
| Campos privados | `_camelCase` (prefijo `_`) | `_playerName` |
| Variables locales | `camelCase` | `totalScore` |
| Parámetros de método | `camelCase` | `playerId` |
| Constantes | `PascalCase` | `MaxPlayers` |
| Enums (tipo y valores) | `PascalCase` | `GameState { Idle, Running, Paused }` |
| Namespaces | `PascalCase` | `GorilaType.Core` |

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

El proyecto usa **nullable reference types** habilitado, por lo tanto toda propiedad o campo debe tener un valor inicial explícito para evitar warnings como `CS8618` (propiedad no nullable sin inicializar).

Regla: **toda propiedad se inicializa según su tipo**, aunque el valor por defecto del tipo ya sea ese (para dejar la intención explícita y evitar el warning).

| Tipo | Valor por defecto a usar |
|---|---|
| `string` | `= string.Empty;` |
| `int` | `= 0;` |
| `float` / `double` | `= 0f;` / `= 0d;` |
| `bool` | `= false;` |
| `List<T>` | `= new List<T>();` |
| `T?` (nullable explícito) | `= null;` (permitido solo si el campo es intencionalmente opcional) |
| Clases propias | `= new NombreClase();` o `= null!;` si se inicializa en constructor |

```csharp
public class GameSession
{
    public string SessionId { get; set; } = string.Empty;
    public List<Player> Players { get; set; } = new List<Player>();
    public int RoundNumber { get; set; } = 0;
}
```

- Si una propiedad **debe** ser nullable porque su ausencia es un estado válido (por ejemplo, "jugador actual, si hay alguno conectado"), se marca explícitamente con `?` y no se fuerza un valor por defecto:

```csharp
public Player? CurrentPlayer { get; set; } = null;
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