# Assets de Documentación — GorilaType

> Ubicación prevista en el repo: `docs/assets/README.md`

Esta carpeta contiene los recursos visuales de la documentación: logo del proyecto, capturas de pantalla y diagramas (incluyendo los modelados con dbdiagram para la base de datos).

## 1. Organización

```
docs/assets/
├── branding/           # Logo y recursos de marca
├── diagramas/           # Diagramas exportados (capturas) y sus fuentes editables
│   └── db/               # Diagramas del modelo de base de datos
└── capturas/            # Capturas de pantalla generales de la documentación
```

## 2. Convención de nombres

Formato general: `<tipo>-<nombre-descriptivo>[-vN].<extensión>`, en `kebab-case`.

| Tipo de archivo           | Ejemplo                                      |
| :------------------------ | :------------------------------------------- |
| Logo                      | `logo-gorilatype.svg`                        |
| Diagrama de arquitectura  | `diagrama-arquitectura-general.png`          |
| Diagrama de base de datos | `diagrama-db-v1.png`, `diagrama-db-v2.png`   |
| Fuente de dbdiagram       | `diagrama-db-v1.dbml`, `diagrama-db-v2.dbml` |
| Captura de pantalla       | `captura-pantalla-resultados.png`            |

## 3. Versionado de diagramas

Los diagramas (en particular el modelo de base de datos) se versionan agregando un sufijo `-vN` al nombre, sin eliminar la versión anterior. Se conserva tanto el archivo fuente (`.dbml`) como la imagen exportada de cada versión, para mantener el historial de cómo evolucionó el modelo.

Cuando se agrega una nueva versión, se actualiza la referencia en los documentos que enlazan al diagrama (ej. `docs/01-arquitectura/decisiones-arquitectonicas.md`) para que apunten a la versión vigente.

## 4. Formato de imágenes

- Capturas y logos rasterizados: `.png`, optimizados para no aumentar innecesariamente el peso del repositorio.
- Logo, si es posible: `.svg`, para que escale sin pérdida de calidad.
