import { AppRoutes } from '@/routes'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { FontSwitcher } from './components/FontSwitcher'

function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <header className="flex justify-end p-4">
        <FontSwitcher />
      </header>
      {/* <AppRoutes></AppRoutes> */}
    </div>
  )
}

export default App
