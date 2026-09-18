# Convención de Documentación — GorilaType

> Ubicación prevista en el repo: `docs/convencion-de-documentacion.md`

Este documento define cómo se escribe y organiza toda la documentación del proyecto, para que cualquier archivo dentro de `docs/` sea consistente con el resto, sin importar cuándo se escribió.

## 1. Idioma

- Toda la documentación se escribe en **español neutro**, sin modismos regionales.
- El código (nombres de variables, funciones, clases) se escribe en **inglés**, siguiendo el estándar de la industria.
- Los comentarios dentro del código se escriben en **español**.

## 2. Organización de carpetas

- Cada carpeta temática dentro de `docs/` se numera con un prefijo de dos dígitos para fijar el orden de lectura (`01-arquitectura/`, `02-flujo-de-trabajo/`, etc.). Dentro de `docs/` directamente, el mismo prefijo se usa para los documentos de contenido (`00-vision-y-alcance.md`, ...).
- Los documentos "meta" — que hablan sobre la documentación en sí, no sobre el proyecto — no llevan prefijo numérico: `docs/README.md` (índice) y este mismo archivo, `docs/convencion-de-documentacion.md`.
- Toda carpeta que contenga más de un archivo debe tener un `README.md` que actúe como índice: lista cada archivo de la carpeta con una descripción de una línea.
- Los nombres de archivo van en minúsculas y con guiones (`kebab-case`): `backend-dotnet.md`, no `Backend_Dotnet.md`.

## 3. Estructura de un documento

Todo documento (salvo los `README.md` de índice) sigue esta estructura:

1. **Título** (`#`): nombre del documento.
2. **Línea de ubicación**: justo debajo del título, en formato blockquote, indicando la ruta prevista del archivo en el repo. Ejemplo:
   ```
   > Ubicación prevista en el repo: `docs/02-flujo-de-trabajo/gitflow.md`
   ```
3. **Introducción breve**: uno o dos párrafos explicando de qué trata el documento y a quién le sirve.
4. **Secciones numeradas** (`## 1. ...`, `## 2. ...`): el cuerpo del documento, dividido por tema. Se usan tablas, listas y bloques de código donde ayude a la claridad, evitando párrafos largos cuando una lista es más clara.
5. **Diagramas**: cuando un diagrama ayude a explicar un flujo o una arquitectura, se usa **Mermaid** embebido directamente en el markdown (como en el README de referencia de FenixCars), para que se renderice sin depender de imágenes externas. Los diagramas que sí requieran una imagen (ej. capturas, modelos exportados de dbdiagram) van en `docs/assets/`, ver `docs/assets/README.md`.

## 4. Índices (`README.md` de carpeta)

Cada `README.md` de índice lista los documentos de su carpeta así:

```markdown
# <Nombre de la carpeta>

| Documento                  | Descripción                |
| :------------------------- | :------------------------- |
| [archivo.md](./archivo.md) | Qué contiene, en una línea |
```

## 5. Historias de usuario

Las historias de usuario siguen su propia plantilla, definida en `docs/04-historias-de-usuario/README.md`. Se redactan en formato clásico ("Como [rol], quiero [acción], para [beneficio]") y cada historia debe representar una sola necesidad — si una historia describe más de una acción independiente (ej. "loguearme y hacer el test"), se separa en varias historias.

## 6. Referencias cruzadas

Cuando un documento depende de una decisión tomada en otro, se enlaza con una ruta relativa en vez de repetir la información. Ejemplo: `jira.md` enlaza a `gitflow.md` en vez de volver a explicar el formato de nombre de rama.

## 7. Cambios y versionado de la documentación

- Los cambios relevantes en la documentación (no el código) se registran en el `CHANGELOG.md` de la raíz del repo.
- Los diagramas de base de datos (fuente `.dbml` de dbdiagram y su captura exportada) se versionan sin borrar la versión anterior; ver `docs/assets/README.md` para la convención de nombres.
