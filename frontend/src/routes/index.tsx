import { Routes, Route } from 'react-router'
import Home from '@/pages/Home/Home'
import NotFound from '@/pages/NotFound/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
