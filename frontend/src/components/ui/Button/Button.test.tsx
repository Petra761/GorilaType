import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza el texto que recibe', () => {
    render(<Button>Click acá</Button>)
    expect(screen.getByText('Click acá')).toBeInTheDocument()
  })
})
