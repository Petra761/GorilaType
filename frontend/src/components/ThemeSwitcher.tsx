// src/components/ThemeSwitcher.tsx
import { useState, useRef, useEffect } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { THEME_CATALOG } from '@/lib/themes/types'
import { useTheme } from '@/lib/themes/ThemeProvider'

export function ThemeSwitcher() {
  const { themeId, mode, setThemeId, toggleMode, canToggleMode } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {canToggleMode && (
        <button
          type="button"
          onClick={toggleMode}
          aria-label={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="rounded-md border border-border bg-surface p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          {mode === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary hover:bg-surface-elevated transition-colors"
      >
        {THEME_CATALOG.find((t) => t.id === themeId)?.label ?? themeId}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full right-0 mt-2 w-40 rounded-md border border-border bg-surface-elevated shadow-lg overflow-hidden z-10"
        >
          {THEME_CATALOG.map((theme) => (
            <li key={theme.id}>
              <button
                type="button"
                role="option"
                aria-selected={theme.id === themeId}
                onClick={() => {
                  setThemeId(theme.id)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  theme.id === themeId
                    ? 'bg-accent text-white'
                    : 'text-text-primary hover:bg-surface'
                }`}
              >
                {theme.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
