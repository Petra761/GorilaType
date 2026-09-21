# Sprint 1

**Fechas:** martes 22 de septiembre – viernes 25 de septiembre de 2026 (sábado y domingo no se trabaja en este proyecto)

**Objetivo:** modelar la base de datos completa del MVP y dejar funcionando el backend de autenticación (JWT propio, OAuth con GitHub/Discord/Google, y recuperación de contraseña).

## Alcance

| Tarea                                            | Jira  | Story Points |
| :----------------------------------------------- | :---- | :----------: |
| Modelar esquema completo en dbdiagram            | GT-8  |      5       |
| Guardar diagrama en docs/assets                  | GT-9  |      1       |
| Crear configuraciones de EF Core                 | GT-10 |      5       |
| Generar y aplicar migración inicial en Supabase  | GT-11 |      2       |
| Registro y login con email y contraseña          | GT-12 |      5       |
| Emisión y validación de JWT (access + refresh)   | GT-13 |      5       |
| OAuth con GitHub                                 | GT-15 |      3       |
| OAuth con Discord                                | GT-16 |      3       |
| OAuth con Google                                 | GT-17 |      3       |
| Recuperación de contraseña (código de 8 dígitos) | GT-18 |      3       |

**Total: 35 story points**

## Fuera de alcance (candidatos a Sprint 2)

- Verificación de email
- Conectar el frontend de `/auth` a los endpoints reales

## Resultado

_Pendiente — se completa al cierre del sprint el viernes._
