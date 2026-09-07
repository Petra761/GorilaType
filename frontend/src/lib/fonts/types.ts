export interface FontDefinition {
  id: string
  label: string
  family: string
  weights: number[]
}

export const FONT_CATALOG: FontDefinition[] = [
  { id: 'jetbrains-mono', label: 'JetBrains Mono', family: 'JetBrains Mono', weights: [400, 700] },
  { id: 'fira-code', label: 'Fira Code', family: 'Fira Code', weights: [400, 500, 700] },
  { id: 'ibm-plex-mono', label: 'IBM Plex Mono', family: 'IBM Plex Mono', weights: [400, 700] },
  { id: 'space-mono', label: 'Space Mono', family: 'Space Mono', weights: [400, 700] },
  { id: 'roboto-mono', label: 'Roboto Mono', family: 'Roboto Mono', weights: [400, 500, 700] },
  {
    id: 'source-code-pro',
    label: 'Source Code Pro',
    family: 'Source Code Pro',
    weights: [400, 600, 700],
  },
  { id: 'cascadia-code', label: 'Cascadia Code', family: 'Cascadia Code', weights: [400, 700] },
  { id: 'chakra-petch', label: 'Chakra Petch', family: 'Chakra Petch', weights: [400, 700] },
]

export const DEFAULT_FONT_ID = 'jetbrains-mono'

export function isValidFontId(id: string): boolean {
  return FONT_CATALOG.some((f) => f.id === id)
}
