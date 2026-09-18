# Estándares de Código — Backend (.NET)

> Ubicación prevista en el repo: `docs/03-estandares-de-codigo/backend-dotnet.md`

## 1. Stack

- .NET 10
- Entity Framework Core
- PostgreSQL 18.x

## 2. Arquitectura

El backend sigue **Clean Architecture**, organizada por capas:

```
backend/
├── GorilaType.Domain/         # Entidades y lógica de negocio pura, sin dependencias externas
├── GorilaType.Application/    # Casos de uso, interfaces de repositorios, DTOs
├── GorilaType.Infrastructure/ # Implementación de repositorios, EF Core, servicios externos (OAuth, email)
└── GorilaType.Api/            # Controllers, configuración, punto de entrada
```

## 3. Acceso a datos

Se usa el **patrón Repository**: los servicios de la capa de Application no acceden directamente al `DbContext`, sino a través de interfaces de repositorio implementadas en Infrastructure. Esto mantiene la capa de Application independiente de EF Core.

## 4. Nomenclatura

Se sigue el estándar de nomenclatura de .NET/C#:

| Elemento                      | Convención                         | Ejemplo                                |
| :---------------------------- | :--------------------------------- | :------------------------------------- |
| Clases, interfaces, métodos   | PascalCase                         | `TypingTestService`, `ITestRepository` |
| Interfaces                    | Prefijo `I`                        | `IUserRepository`                      |
| Variables locales, parámetros | camelCase                          | `wordsPerMinute`                       |
| Constantes                    | PascalCase                         | `MaxTestDurationSeconds`               |
| Namespaces                    | Reflejan la estructura de carpetas | `GorilaType.Application.Tests`         |

Los nombres de clases, métodos y variables se escriben en **inglés**; los comentarios se escriben en **español**.

## 5. Formateo y linting

- **CSharpier** para formateo automático de código, con configuración por defecto salvo que se documente una excepción específica.

## 6. Testing

Se escriben tests automatizados para el backend (unitarios como mínimo; de integración donde el caso lo amerite, ej. endpoints críticos de autenticación).

## 7. Autenticación

- JWT administrado por el propio backend (sin usar una librería de identidad completa como ASP.NET Identity).
- El flujo de OAuth (GitHub, Discord, Google) es manejado enteramente por el backend, por seguridad — el frontend nunca maneja tokens de los proveedores directamente.

## 8. CI

La ejecución de linters/analizadores automáticos en CI (GitHub Actions) queda para una fase posterior al MVP inicial.

## 9. Pendiente de definir

- Reglas específicas de CSharpier si se necesita desviarse del default.
- Convención de manejo de errores/excepciones (aún no definida).
