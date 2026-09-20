// frontend/src/routes/AppRouter.tsx
// Definición centralizada de todas las rutas de la aplicación
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../shared/components/layout/MainLayout";
import { HomePage } from "../features/typing-test/pages/HomePage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";
import { LeaderboardPage } from "../features/leaderboard/pages/LeaderboardPage";
import { AuthPage } from "../features/auth/pages/AuthPage";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import { AboutPage } from "../features/about/pages/AboutPage";
import { NotFoundPage } from "../features/not-found/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/leaderboard", element: <LeaderboardPage /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/auth/reset-password", element: <ResetPasswordPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
