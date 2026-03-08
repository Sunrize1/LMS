import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <Link to="/classes" className="text-xl font-bold tracking-tight text-white">
              LMS
            </Link>
            <div className="flex gap-1">
              <Link
                to="/classes"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  isActive('/classes')
                    ? 'bg-white/20 text-white'
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                Классы
              </Link>
              <Link
                to="/profile"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  isActive('/profile')
                    ? 'bg-white/20 text-white'
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                Профиль
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-indigo-100">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="rounded-md border border-white/30 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Выйти
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
