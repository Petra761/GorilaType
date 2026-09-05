// src/components/ThemeSwitcher.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ThemeContext } from '@/lib/themes/ThemeProvider'

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ThemeSwitcher>

function withThemeContext(value: {
  themeId: string
  mode: 'dark' | 'light'
  canToggleMode: boolean
}) {
  return (Story: () => React.ReactElement) => (
    <ThemeContext.Provider
      value={{
        themeId: value.themeId,
        mode: value.mode,
        canToggleMode: value.canToggleMode,
        setThemeId: fn(),
        toggleMode: fn(),
      }}
    >
      <Story />
    </ThemeContext.Provider>
  )
}

export const MalachiteDark: Story = {
  decorators: [withThemeContext({ themeId: 'malachite', mode: 'dark', canToggleMode: true })],
  render: () => <ThemeSwitcher />,
}

export const MalachiteLight: Story = {
  decorators: [withThemeContext({ themeId: 'malachite', mode: 'light', canToggleMode: true })],
  render: () => <ThemeSwitcher />,
}

export const SoloOscuroSinToggle: Story = {
  name: 'Chaos Theory (sin toggle sol/luna)',
  decorators: [withThemeContext({ themeId: 'chaos-theory', mode: 'dark', canToggleMode: false })],
  render: () => <ThemeSwitcher />,
}
