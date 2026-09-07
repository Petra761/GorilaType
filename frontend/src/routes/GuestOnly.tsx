import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@/store/authStore'

export function GuestOnly() {
  const user = useAuthStore((state) => state.user)
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) {
    return <div>Cargando...</div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
