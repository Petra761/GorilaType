import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  THEME_CATALOG,
  DEFAULT_THEME_ID,
  DEFAULT_MODE,
  themeSupportsToggle,
  type ThemeMode,
} from './types'

const THEME_STORAGE_KEY = 'gorilatype:theme-id'
const MODE_STORAGE_KEY = 'gorilatype:mode'

interface ThemeContextValue {
  themeId: string
  mode: ThemeMode
  setThemeId: (id: string) => void
  toggleMode: () => void
  canToggleMode: boolean
}

export const ThemeContext = createContext<ThemeContextValue | null>(null) // antes sin "export"

function resolveMode(themeId: string, preferredMode: ThemeMode): ThemeMode {
  const theme = THEME_CATALOG.find((t) => t.id === themeId)
  if (!theme) return DEFAULT_MODE
  if (theme.variants[preferredMode]) return preferredMode
  // el tema no soporta el modo preferido: cae a la única variante disponible
  const fallback = (Object.keys(theme.variants) as ThemeMode[])[0]
  return fallback ?? DEFAULT_MODE
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(
    () => localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME_ID,
  )
  const [preferredMode, setPreferredMode] = useState<ThemeMode>(
    () => (localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null) ?? DEFAULT_MODE,
  )

  const activeTheme = THEME_CATALOG.find((t) => t.id === themeId) ?? THEME_CATALOG[0]
  const mode = resolveMode(themeId, preferredMode)
  const canToggleMode = themeSupportsToggle(activeTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    document.documentElement.setAttribute('data-mode', mode)
  }, [themeId, mode])

  function setThemeId(id: string) {
    setThemeIdState(id)
    localStorage.setItem(THEME_STORAGE_KEY, id)
  }

  function toggleMode() {
    if (!canToggleMode) return
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setPreferredMode(next)
    localStorage.setItem(MODE_STORAGE_KEY, next)
  }

  return (
    <ThemeContext.Provider value={{ themeId, mode, setThemeId, toggleMode, canToggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
