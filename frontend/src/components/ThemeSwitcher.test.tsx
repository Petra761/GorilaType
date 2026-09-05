import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useTheme } from '@/lib/themes/ThemeProvider'

vi.mock('@/lib/themes/ThemeProvider', () => ({
  useTheme: vi.fn(),
}))

const mockedUseTheme = vi.mocked(useTheme)

function setThemeState(overrides: Partial<ReturnType<typeof useTheme>> = {}) {
  mockedUseTheme.mockReturnValue({
    themeId: 'malachite',
    mode: 'dark',
    setThemeId: vi.fn(),
    toggleMode: vi.fn(),
    canToggleMode: true,
    ...overrides,
  })
}

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el nombre del tema activo', () => {
    setThemeState({ themeId: 'malachite' })
    render(<ThemeSwitcher />)
    expect(screen.getByRole('button', { name: /malachite/i })).toBeInTheDocument()
  })

  it('muestra el botón sol/luna cuando el tema soporta ambos modos', () => {
    setThemeState({ canToggleMode: true })
    render(<ThemeSwitcher />)
    expect(screen.getByLabelText(/cambiar a modo/i)).toBeInTheDocument()
  })

  it('oculta el botón sol/luna cuando el tema es de un solo modo', () => {
    setThemeState({ canToggleMode: false })
    render(<ThemeSwitcher />)
    expect(screen.queryByLabelText(/cambiar a modo/i)).not.toBeInTheDocument()
  })

  it('llama a toggleMode al hacer clic en el botón sol/luna', async () => {
    const toggleMode = vi.fn()
    setThemeState({ canToggleMode: true, mode: 'dark', toggleMode })
    render(<ThemeSwitcher />)

    await userEvent.click(screen.getByLabelText(/cambiar a modo/i))
    expect(toggleMode).toHaveBeenCalledOnce()
  })

  it('abre el listado de temas al hacer clic en el selector', async () => {
    setThemeState()
    render(<ThemeSwitcher />)

    await userEvent.click(screen.getByRole('button', { name: /malachite/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /chaos theory/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /serika/i })).toBeInTheDocument()
  })

  it('llama a setThemeId y cierra el listado al elegir un tema', async () => {
    const setThemeId = vi.fn()
    setThemeState({ setThemeId })
    render(<ThemeSwitcher />)

    await userEvent.click(screen.getByRole('button', { name: /malachite/i }))
    await userEvent.click(screen.getByRole('option', { name: /serika/i }))

    expect(setThemeId).toHaveBeenCalledWith('serika')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('cierra el listado al hacer clic fuera del componente', async () => {
    setThemeState()
    render(
      <div>
        <ThemeSwitcher />
        <button>fuera</button>
      </div>,
    )

    await userEvent.click(screen.getByRole('button', { name: /malachite/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /fuera/i }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
