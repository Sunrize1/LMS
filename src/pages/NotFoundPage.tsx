import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <p className="text-8xl font-bold text-indigo-600">404</p>
      <p className="mt-4 text-lg text-gray-600">Страница не найдена</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        На главную
      </Link>
    </div>
  )
}
