import { readFileSync } from 'node:fs'
import { transformSync } from 'esbuild'
import type { Plugin } from 'vite'

const CATALOG_PATH = 'src/lib/themes/types.ts'
const PLACEHOLDER = '__THEME_VARIANTS_JSON__'

function extractVariants(): Record<string, Record<string, true>> {
  const source = readFileSync(CATALOG_PATH, 'utf-8')
  const { code } = transformSync(source, { loader: 'ts', format: 'cjs' })

  const mod = { exports: {} as Record<string, unknown> }
  new Function('module', 'exports', code)(mod, mod.exports)

  const catalog = mod.exports.THEME_CATALOG as Array<{
    id: string
    variants: Record<string, true>
  }>

  return Object.fromEntries(catalog.map((t) => [t.id, t.variants]))
}

export function themeCatalogPlugin(): Plugin {
  return {
    name: 'gorilatype-theme-catalog',
    transformIndexHtml(html) {
      return html.replace(PLACEHOLDER, JSON.stringify(extractVariants()))
    },
  }
}
