import { Button } from '@/components/ui/Button/Button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white">
      <h1 className="text-4xl font-bold tracking-tight">GorilaType</h1>
      <p className="rounded-lg bg-emerald-500/20 px-4 py-2 text-emerald-300">
        ✅ Si ves este fondo degradado y este texto verde, Tailwind está funcionando.
      </p>
      <Button>Botón de prueba</Button>
    </main>
  )
}
