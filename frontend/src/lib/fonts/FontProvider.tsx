import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_FONT_ID, isValidFontId } from './types'

const FONT_STORAGE_KEY = 'gorilatype:typing-font-id'

interface FontContextValue {
  fontId: string
  setFontId: (id: string) => void
}

export const FontContext = createContext<FontContextValue | null>(null)

function resolveFontId(id: string | null): string {
  if (id && isValidFontId(id)) return id
  return DEFAULT_FONT_ID
}

export function FontProvider({ children }: { children: ReactNode }) {
  const [fontId, setFontIdState] = useState<string>(() =>
    resolveFontId(localStorage.getItem(FONT_STORAGE_KEY)),
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-typing-font', fontId)
  }, [fontId])

  function setFontId(id: string) {
    if (!isValidFontId(id)) return
    setFontIdState(id)
    localStorage.setItem(FONT_STORAGE_KEY, id)
  }

  return <FontContext.Provider value={{ fontId, setFontId }}>{children}</FontContext.Provider>
}

export function useFont() {
  const ctx = useContext(FontContext)
  if (!ctx) throw new Error('useFont debe usarse dentro de <FontProvider>')
  return ctx
}
