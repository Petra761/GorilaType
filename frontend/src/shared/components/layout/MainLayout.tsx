// Layout base de la aplicación: header simple + espacio para el contenido de cada página
import { Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div>
      <header>
        <h2>GorilaType</h2>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
