// src/components/FontSwitcher.tsx
import { useState, useRef, useEffect } from 'react'
import { FONT_CATALOG } from '@/lib/fonts/types'
import { useFont } from '@/lib/fonts/FontProvider'

export function FontSwitcher() {
  const { fontId, setFontId } = useFont()
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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary hover:bg-surface-elevated transition-colors"
      >
        {FONT_CATALOG.find((f) => f.id === fontId)?.label ?? fontId}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full right-0 mt-2 w-48 rounded-md border border-border bg-surface-elevated shadow-lg overflow-hidden z-10"
        >
          {FONT_CATALOG.map((font) => (
            <li key={font.id}>
              <button
                type="button"
                role="option"
                aria-selected={font.id === fontId}
                onClick={() => {
                  setFontId(font.id)
                  setOpen(false)
                }}
                style={{ fontFamily: `'${font.family}', monospace` }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  font.id === fontId ? 'bg-accent text-white' : 'text-text-primary hover:bg-surface'
                }`}
              >
                {font.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
