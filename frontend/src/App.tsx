import { AppRoutes } from '@/routes'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { FontSwitcher } from './components/FontSwitcher'
import { useAppInit } from '@/hooks/useAppInit'
import { useAuthStore } from '@/store/authStore'

function App() {
  useAppInit()
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">
        Cargando...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <header className="flex justify-end p-4">
        <FontSwitcher />
      </header>
      <AppRoutes />
    </div>
  )
}

export default App
