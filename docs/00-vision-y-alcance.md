# Visión y Alcance — GorilaType

> Ubicación prevista en el repo: `docs/00-vision-y-alcance.md`

## 1. Introducción

GorilaType es una plataforma web de mecanografía inspirada en Monkeytype, concebida como un proyecto de aprendizaje para aplicar prácticas profesionales de desarrollo (documentación, flujo de trabajo con Git, arquitectura, estándares de código) y construir un producto que también funcione como pieza destacada de portafolio profesional.

No se limita a un test de mecanografía simple: la visión a largo plazo incluye un módulo de lecciones estructuradas (estilo TypingClub) y un modo competitivo PvP / battle royale (estilo Tetr.io, aplicado a mecanografía).

## 2. Objetivos del proyecto

- Igualar o superar la calidad y el conjunto de características de Monkeytype.
- Servir como ejercicio práctico de buenas prácticas de ingeniería de software (documentación, Gitflow, Jira, estándares de código, arquitectura).
- Construir un producto con calidad suficiente para destacar en un CV.
- Sentar una base de datos y arquitectura que no tenga que rediseñarse al incorporar las fases futuras (lecciones, PvP, monetización).

## 3. Alcance del MVP

El MVP cubre el test de mecanografía completo, con todas las características de Monkeytype, más sistema de cuentas de usuario, perfil y personalización. Lecciones y PvP/battle royale quedan fuera del MVP pero están contempladas en el diseño de datos.

### 3.1 Test de mecanografía

- Todos los modos de test de Monkeytype (tiempo, palabras, cita, personalizado, etc.) — ninguno queda excluido.
- Idiomas disponibles: español e inglés.
- Configuraciones específicas por idioma. En español: opción para que el sistema acepte como correcta tanto la escritura con tilde/ñ como sin ella (no se modifica el texto del test, se flexibiliza la validación de lo escrito).
- Opciones de test: incluir/excluir puntuación, incluir/excluir números, distinción de mayúsculas/minúsculas.
- Niveles de dificultad estilo Monkeytype (normal / expert — falla el test ante un error / master), independientes de los sets de palabras por dificultad (ej. top 200, top 1000).
- Sin progreso en vivo de rival en el test individual (se reserva para PvP, por consumo de recursos).
- Pantalla de resultados: gráfico de WPM, accuracy, tipo de test, raw, desglose de caracteres (correctos/incorrectos/extra/perdidos), consistencia, tiempo y leaderboard diario.
- Reintento del mismo texto disponible mediante botón manual; los reintentos no se cuentan en el historial ni afectan las métricas del usuario.
- Personalización: temas de color, tipografía, sonidos, modo ciego, estilo del caret.
- Diseño visual base definido junto con el branding, preparado para soportar temas adicionales a futuro.
- Requisito de accesibilidad desde el MVP.
- Soporte de distribución de teclado limitado a QWERTY en el MVP, con la base preparada para sumar otras distribuciones (Dvorak, Colemak, etc.) más adelante.

### 3.2 Autenticación y cuentas

- Registro/login con email + contraseña, y OAuth con GitHub, Discord y Google.
- Verificación de email opcional tras el registro; mientras no esté verificada, el usuario puede usar la cuenta pero no participar en funciones con otros jugadores (ej. leaderboard).
- Recuperación de contraseña mediante código de 8 dígitos con expiración.
- Sin sistema de roles en el MVP (todos los usuarios son del mismo tipo); no se descarta a futuro.
- Modo invitado disponible, sin necesidad de cuenta.

### 3.3 Perfil y estadísticas

- Perfil público por usuario.
- Historial completo de tests para seguimiento de evolución.
- Grid de práctica (estilo contribuciones de GitHub / Monkeytype): la intensidad de cada día refleja la cantidad de tests realizados ese día en relación a los demás días.
- Récords personales: se notifica "nuevo récord" al superar una marca anterior, como refuerzo de motivación.
- Imagen de perfil: subida por el usuario (optimizada automáticamente para no ocupar espacio excesivo), con imagen por defecto generada a partir del nombre si no sube una; los usuarios registrados vía OAuth heredan por defecto el nombre e imagen de ese proveedor.

### 3.4 Datos y métricas

- Se registran tanto métricas de producto (uso, retención) como de rendimiento del usuario (para perfil y leaderboard).
- Métricas de producto mínimas para el MVP: tests completados por día, usuarios activos, retención.
- Herramienta de analítica externa: aún sin definir.

## 4. Fuera de alcance del MVP (roadmap futuro, ya contemplado en el diseño de datos)

- **Lecciones estructuradas** (estilo TypingClub), organizadas en distintos grupos/tipos de curso (ej. mecanografía en español/inglés con ambas manos), pensadas para poder ir agregando más cursos con el tiempo.
- **PvP / battle royale** (estilo Tetr.io): salas creadas con un código de invitación para hasta N jugadores; el límite exacto de jugadores queda pendiente de definir. Incluirá progreso en vivo de los rivales, configurable para minimizar distracciones.
- **Leaderboard filtrable** por idioma, modo y período (diario, semanal, histórico) — el leaderboard base es parte del MVP; los filtros avanzados se refinarán en esta fase si corresponde.
- **Monetización** (anuncios, compras para desbloquear lecciones, etc.): condicionada a la rentabilidad del proyecto una vez lanzado el producto inicial.
- Soporte de distribuciones de teclado adicionales a QWERTY.

## 5. Pendiente de definir

- Listado de páginas/rutas e historias de usuario iniciales.
- Límite de jugadores por sala de PvP/battle royale.
- Herramienta de analítica externa.
- Licencia del repositorio (en evaluación).
