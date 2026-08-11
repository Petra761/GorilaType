import { Button } from '@/components/ui/Button/Button'
import { useTheme } from '@/hooks/useTheme'

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
      <h1 className="text-4xl font-bold tracking-tight text-primary">GorilaType</h1>
      <p className="rounded-lg bg-background-alt px-4 py-2 text-muted">
        Tema activo: <span className="text-primary">{theme}</span>
      </p>
      <div className="flex gap-3">
        <Button onClick={() => setTheme('serika-dark')}>Serika Dark</Button>
        <Button variant="secondary" onClick={() => setTheme('chaos-theory')}>
          Chaos Theory
        </Button>
      </div>
    </main>
  )
}
