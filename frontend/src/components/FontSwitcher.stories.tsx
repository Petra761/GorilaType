import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { FontSwitcher } from './FontSwitcher'
import { FontContext } from '@/lib/fonts/FontProvider'

const meta: Meta<typeof FontSwitcher> = {
  title: 'Components/FontSwitcher',
  component: FontSwitcher,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof FontSwitcher>

function withFontContext(value: { fontId: string }) {
  return (Story: () => React.ReactElement) => (
    <FontContext.Provider
      value={{
        fontId: value.fontId,
        setFontId: fn(),
      }}
    >
      <Story />
    </FontContext.Provider>
  )
}

export const JetBrainsMono: Story = {
  decorators: [withFontContext({ fontId: 'jetbrains-mono' })],
  render: () => <FontSwitcher />,
}

export const FiraCode: Story = {
  decorators: [withFontContext({ fontId: 'fira-code' })],
  render: () => <FontSwitcher />,
}
