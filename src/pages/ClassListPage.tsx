import { useState } from 'react'
import { useClassesQuery } from '@/features/classes/hooks/useClassesQuery'
import { ClassCard } from '@/features/classes/ClassCard'
import { ClassCardSkeleton } from '@/features/classes/ClassCardSkeleton'

export default function ClassListPage() {
  const { data: classes, isLoading } = useClassesQuery()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Мои классы</h1>
        <div className="relative">
          <button
            data-testid="add-class-button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Добавить
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
              <button
                onClick={() => setMenuOpen(false)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Создать класс
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Присоединиться по коду
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ClassCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && classes && classes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">У вас пока нет классов</p>
          <p className="mt-2 text-sm text-gray-400">Создайте класс или присоединитесь по коду</p>
        </div>
      )}

      {!isLoading && classes && classes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} />
          ))}
        </div>
      )}
    </div>
  )
}
