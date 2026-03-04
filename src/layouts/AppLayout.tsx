import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/classes" className="text-xl font-bold text-gray-900">
            LMS
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
              {user?.firstName} {user?.lastName}
            </Link>
            <button
              onClick={logout}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
            >
              Выйти
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
