# Backlog

Backlog completo y vivo del proyecto, organizado por épica. Se actualiza en cada sprint: se agregan tareas nuevas, se marcan las completadas y se ajustan story points si cambian. Para ver qué se trabajó en una semana puntual, ver [sprints/](./sprints/README.md).

## GT-1 · Fundamentos y Configuración Inicial (completada)

| Tarea                                    | Jira | Estado |
| :--------------------------------------- | :--- | :----- |
| Documentación base del proyecto          | GT-2 | Hecho  |
| Estructura inicial de frontend y backend | GT-4 | Hecho  |

## GT-6 · Modelo de Datos

| Tarea                                           | Jira  | Story Points | Estado    |
| :---------------------------------------------- | :---- | :----------: | :-------- |
| Modelar esquema completo en dbdiagram           | GT-8  |      5       | Por hacer |
| Guardar diagrama en docs/assets                 | GT-9  |      1       | Por hacer |
| Crear configuraciones de EF Core                | GT-10 |      5       | Por hacer |
| Generar y aplicar migración inicial en Supabase | GT-11 |      2       | Por hacer |

## GT-7 · Autenticación

| Tarea                                            | Jira  | Story Points | Estado    |
| :----------------------------------------------- | :---- | :----------: | :-------- |
| Registro y login con email y contraseña          | GT-12 |      5       | Por hacer |
| Emisión y validación de JWT (access + refresh)   | GT-13 |      5       | Por hacer |
| Configurar OAuth                                 | GT-14 |      —       | Por hacer |
| &nbsp;&nbsp;↳ OAuth con GitHub                   | GT-15 |      3       | Por hacer |
| &nbsp;&nbsp;↳ OAuth con Discord                  | GT-16 |      3       | Por hacer |
| &nbsp;&nbsp;↳ OAuth con Google                   | GT-17 |      3       | Por hacer |
| Recuperación de contraseña (código de 8 dígitos) | GT-18 |      3       | Por hacer |

## Pendiente de priorizar (candidatos a sprints futuros)

- Verificación de email
- Conectar el frontend de `/auth` (páginas creadas en GT-4) a los endpoints reales
