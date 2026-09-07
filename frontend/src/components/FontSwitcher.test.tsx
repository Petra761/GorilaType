import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FontSwitcher } from './FontSwitcher'
import { useFont } from '@/lib/fonts/FontProvider'

vi.mock('@/lib/fonts/FontProvider', () => ({
  useFont: vi.fn(),
}))

const mockedUseFont = vi.mocked(useFont)

function setFontState(overrides: Partial<ReturnType<typeof useFont>> = {}) {
  mockedUseFont.mockReturnValue({
    fontId: 'jetbrains-mono',
    setFontId: vi.fn(),
    ...overrides,
  })
}

describe('FontSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el nombre de la fuente activa', () => {
    setFontState({ fontId: 'jetbrains-mono' })
    render(<FontSwitcher />)
    expect(screen.getByRole('button', { name: /jetbrains mono/i })).toBeInTheDocument()
  })

  it('abre el listado de fuentes al hacer clic en el selector', async () => {
    setFontState()
    render(<FontSwitcher />)

    await userEvent.click(screen.getByRole('button', { name: /jetbrains mono/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /fira code/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /space mono/i })).toBeInTheDocument()
  })

  it('llama a setFontId y cierra el listado al elegir una fuente', async () => {
    const setFontId = vi.fn()
    setFontState({ setFontId })
    render(<FontSwitcher />)

    await userEvent.click(screen.getByRole('button', { name: /jetbrains mono/i }))
    await userEvent.click(screen.getByRole('option', { name: /fira code/i }))

    expect(setFontId).toHaveBeenCalledWith('fira-code')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('cierra el listado al hacer clic fuera del componente', async () => {
    setFontState()
    render(
      <div>
        <FontSwitcher />
        <button>fuera</button>
      </div>,
    )

    await userEvent.click(screen.getByRole('button', { name: /jetbrains mono/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /fuera/i }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
