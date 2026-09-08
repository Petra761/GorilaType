import { Routes, Route } from 'react-router'
import Home from '@/pages/Home/Home'
import NotFound from '@/pages/NotFound/NotFound'
import Auth from '@/pages/Auth/Auth'
import ForgotPassword from '@/pages/ForgotPassword/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword/ResetPassword'
import OAuthCallback from '@/pages/OAuthCallback/OAuthCallback'
import Profile from '@/pages/Profile/Profile'
import Settings from '@/pages/Settings/Settings'
import Leaderboard from '@/pages/Leaderboard/Leaderboard'
import About from '@/pages/About/About'
import { RequireAuth } from '@/routes/RequireAuth'
import { GuestOnly } from '@/routes/GuestOnly'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth/callback/:provider" element={<OAuthCallback />} />

      <Route element={<GuestOnly />}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
