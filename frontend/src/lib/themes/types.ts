export type ThemeMode = 'light' | 'dark'

export interface ThemeDefinition {
  id: string
  label: string
  variants: Partial<Record<ThemeMode, true>>
}

export const THEME_CATALOG: ThemeDefinition[] = [
  {
    id: 'malachite',
    label: 'Malachite',
    variants: { dark: true, light: true },
  },
  {
    id: 'serika',
    label: 'Serika',
    variants: { dark: true },
  },
  {
    id: 'chaos-theory',
    label: 'Chaos Theory',
    variants: { dark: true },
  },
]

export const DEFAULT_THEME_ID = 'malachite'
export const DEFAULT_MODE: ThemeMode = 'dark'

export function themeSupportsToggle(theme: ThemeDefinition): boolean {
  return Object.keys(theme.variants).length > 1
}
