# Arquitectura — Backend

> Ubicación prevista en el repo: `docs/01-arquitectura/backend.md`

## 1. Capas (Clean Architecture)

```
backend/
├── GorilaType.Domain/
├── GorilaType.Application/
├── GorilaType.Infrastructure/
└── GorilaType.Api/
```

El detalle de cada capa y del patrón Repository está en [docs/03-estandares-de-codigo/backend-dotnet.md](../03-estandares-de-codigo/backend-dotnet.md).

## 2. Organización por módulo dentro de cada capa

Dentro de `Domain`, `Application` e `Infrastructure`, el código se organiza por módulo de negocio, no de forma plana. Cada módulo solo existe una vez que tiene contenido real que ubicar ahí — no se crean carpetas vacías de antemano.

Módulos previstos para el MVP:

| Módulo          | Responsabilidad                                                                                                        |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Users**       | Registro, login (email/contraseña y OAuth), perfil, recuperación de contraseña                                         |
| **TypingTests** | Configuración y ejecución del test, cálculo de resultados (WPM, accuracy, consistencia), historial, récords personales |
| **Content**     | Listas de palabras y citas por idioma y dificultad, configuraciones especiales por idioma (ej. acentos/ñ en español)   |
| **Leaderboard** | Ranking filtrable por idioma, modo y período                                                                           |

Ejemplo de cómo se vería `Domain` con esta organización:

```
GorilaType.Domain/
├── Users/
│   ├── User.cs
│   └── AuthProvider.cs
├── TypingTests/
│   ├── TypingTest.cs
│   ├── TestResult.cs
│   └── PersonalRecord.cs
├── Content/
│   └── WordSet.cs
└── Leaderboard/
    └── LeaderboardEntry.cs
```

La misma lógica de módulos se repite en `Application` e `Infrastructure`. Tomando `Users` como ejemplo completo, a través de las cuatro capas:

```
GorilaType.Application/
└── Users/
    ├── Dtos/
    │   ├── UserDto.cs
    │   ├── RegisterUserRequest.cs
    │   └── LoginResponse.cs
    ├── Interfaces/
    │   └── IUserRepository.cs
    └── UseCases/
        ├── RegisterUserUseCase.cs
        └── LoginUserUseCase.cs

GorilaType.Infrastructure/
└── Users/
    ├── Repositories/
    │   └── UserRepository.cs        # implementa IUserRepository con EF Core
    └── Persistence/
        └── Configurations/
            └── UserConfiguration.cs # IEntityTypeConfiguration<User>: mapeo de la entidad a la tabla

GorilaType.Api/
└── Controllers/
    └── UsersController.cs           # usa los DTOs definidos en Application, no duplica sus propios
```

**DTOs**: viven en `Application/<Módulo>/Dtos/`. Son los que entran y salen de los casos de uso; el controller de `Api` los reutiliza directamente en vez de definir sus propios request/response, para no duplicar clases equivalentes en dos capas.

**Configuraciones de EF Core**: las clases `IEntityTypeConfiguration<T>` (el mapeo de cada entidad a su tabla) van en `Infrastructure/<Módulo>/Persistence/Configurations/`, separadas del `DbContext` para que este no termine con todos los mapeos amontonados en un solo archivo.

**Configuración de la aplicación** (`appsettings.json`, cadenas de conexión, Options pattern): es un concepto distinto, no ligado a un módulo de negocio — vive en `GorilaType.Api/` como configuración transversal de toda la aplicación.

## 3. Pendiente de definir

- Si `Leaderboard` termina siendo un módulo propio o parte de `TypingTests` (se decidirá al implementarlo, según cuánta lógica propia termine teniendo).
- Módulos futuros (`Lessons`, `Pvp`) se agregarán a esta tabla cuando se aborden esas fases — no se crean carpetas para ellos todavía.
