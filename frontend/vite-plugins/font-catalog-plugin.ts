import { readFileSync } from 'node:fs'
import { transformSync } from 'esbuild'
import type { Plugin } from 'vite'

const CATALOG_PATH = 'src/lib/fonts/types.ts'
const PLACEHOLDER = '__FONT_IDS_JSON__'

function extractFontIds(): string[] {
  const source = readFileSync(CATALOG_PATH, 'utf-8')
  const { code } = transformSync(source, { loader: 'ts', format: 'cjs' })

  const mod = { exports: {} as Record<string, unknown> }
  new Function('module', 'exports', code)(mod, mod.exports)

  const catalog = mod.exports.FONT_CATALOG as Array<{ id: string }>

  return catalog.map((f) => f.id)
}

export function fontCatalogPlugin(): Plugin {
  return {
    name: 'gorilatype-font-catalog',
    transformIndexHtml(html) {
      return html.replace(PLACEHOLDER, JSON.stringify(extractFontIds()))
    },
  }
}
