import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-600">LMS</h2>
          <p className="mt-1 text-sm text-gray-500">Система управления обучением</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
