# Markdown Style Guide

> Este documento define **cómo se debe escribir cualquier archivo `.md`** dentro del proyecto GorilaType. Aplica tanto si el documento lo escribe una persona como si lo genera una IA. El objetivo es que toda la documentación tenga la misma estructura, el mismo tono y el mismo formato, sin importar quién la escriba.

---

## 1. Idioma

- **Contenido:** siempre en **español**.
- **Nombres técnicos:** en **inglés**. Esto incluye:
  - Nombres de archivo (`git-flow.md`, no `flujo-git.md`)
  - Nombres de carpeta (`guidelines/`, no `guias/`)
  - Encabezados que sean términos técnicos estándar (`## Prerequisites`, `## Installation`) cuando el término en inglés es el más usado y reconocible en la industria.
- Si un encabezado no es un término técnico estándar, se escribe en español (`## Cómo contribuir`, no `## How to contribute`).
- No mezclar idiomas dentro de una misma oración. No hacer "spanglish".

---

## 2. Nombre de archivos

- Formato: `kebab-case`, todo en minúsculas, en inglés.
  - ✅ `functional-requirements.md`
  - ❌ `RequisitosFuncionales.md`
  - ❌ `Requisitos_Funcionales.md`
- El nombre debe describir el contenido, no el tipo de documento genérico.
  - ✅ `naming-conventions.md`
  - ❌ `doc1.md`

---

## 3. Ubicación

- Todo `.md` de documentación del proyecto vive dentro de `docs/`, en la subcarpeta que corresponda según el tipo de contenido (`requirements/`, `guidelines/`, `workflow/`, `architecture/`, `setup/`).
- Si el documento no encaja en ninguna carpeta existente, se debe evaluar si corresponde crear una nueva subcarpeta, no dejarlo suelto en la raíz de `docs/`.
- Excepción: `docs/README.md` es el único `.md` que vive en la raíz de `docs/`, ya que actúa como índice general.

---

## 4. Estructura obligatoria de un documento

Todo archivo `.md` de documentación debe empezar con este bloque:

```markdown
# Título del documento

> Breve descripción de una o dos líneas: qué es este documento y para quién es.

**Última actualización:** YYYY-MM-DD
**Autor(es):** Nombre o equipo

---
```

Después de ese bloque inicial, el contenido se organiza libremente, pero siguiendo las reglas de jerarquía de encabezados de la sección 5.

---

## 5. Jerarquía de encabezados

- `#` (H1): solo uno por documento, es el título. Coincide con el nombre del archivo en formato legible.
- `##` (H2): secciones principales.
- `###` (H3): subsecciones dentro de una sección principal.
- No saltar niveles (no pasar de `##` a `####` directamente).
- No usar `#` o `##` para énfasis; para eso usar **negrita**.

---

## 6. Formato general

- **Listas:** usar `-` para listas sin orden. Usar `1.` para pasos secuenciales (ej: instrucciones de instalación).
- **Negrita:** para resaltar términos clave o advertencias (`**importante**`).
- **Cursiva:** para aclaraciones o notas al margen.
- **Código inline:** usar backticks simples para nombres de variables, funciones, comandos o archivos (`useState`, `git-flow.md`).
- **Bloques de código:** siempre con el lenguaje especificado.

  ````markdown
  ```bash
  npm run dev
  ```
  ````

- **Tablas:** usarlas cuando se comparen ítems con los mismos atributos (ej: lista de requisitos, comparación de opciones). No abusar de tablas para contenido narrativo.
- **Links internos:** usar rutas relativas (`[Git Flow](../workflow/git-flow.md)`), nunca rutas absolutas del sistema de archivos.
- **Imágenes/diagramas:** guardar en `docs/assets/` y referenciar con ruta relativa.

---

## 7. Identificadores (para requisitos, reglas, etc.)

Cuando un documento define ítems que se van a referenciar después (requisitos, reglas de negocio, decisiones técnicas), cada ítem debe tener un ID único y estable:

```markdown
**RF-01** — El usuario debe poder iniciar sesión con correo y contraseña.
**RNF-03** — El sistema debe responder en menos de 2 segundos bajo carga normal.
```

- El ID nunca se reutiliza ni se reordena, aunque el ítem se elimine (se marca como `(deprecated)` en vez de borrarse el número).

---

## 8. Tono y estilo de redacción

- Redacción clara, directa y sin relleno. Evitar frases largas innecesarias.
- Usar voz activa: "El sistema valida el correo" en vez de "El correo es validado por el sistema".
- Evitar jerga innecesaria; si un término técnico no es obvio, aclararlo la primera vez que aparece.
- No usar humor, sarcasmo ni comentarios personales dentro de la documentación técnica.

---

## 9. Instrucciones específicas para IA

Si este documento se usa como referencia para que una IA genere documentación del proyecto, la IA debe:

1. Aplicar **todas** las reglas anteriores sin excepción.
2. Generar el bloque de metadata inicial (sección 4) completo, usando la fecha del día en formato `YYYY-MM-DD`.
3. No inventar contenido: si falta información para completar una sección, dejar un marcador explícito `<!-- TODO: completar -->` en vez de rellenar con suposiciones.
4. Mantener consistencia de nombres con archivos ya existentes en `docs/` (por ejemplo, no crear `Naming_Conventions.md` si ya existe `naming-conventions.md`).
5. No traducir automáticamente términos técnicos de uso estándar en inglés (ej: no traducir "commit", "pull request", "branch", "build").
6. Al finalizar, verificar que el documento generado cumple la sección 5 (jerarquía de encabezados) y la sección 2 (nombre de archivo).

---

## 10. Checklist rápido antes de subir un `.md`

- [ ] El archivo está en `kebab-case` y en inglés.
- [ ] Está ubicado en la subcarpeta correcta de `docs/`.
- [ ] Tiene el bloque de metadata inicial (título, descripción, fecha, autor).
- [ ] Los encabezados siguen la jerarquía sin saltos.
- [ ] El contenido está en español, salvo términos técnicos.
- [ ] Los bloques de código tienen el lenguaje especificado.
- [ ] Los links internos son relativos.