import { useState } from 'react'
import { useClassesQuery } from '@/features/classes/hooks/useClassesQuery'
import { ClassCard } from '@/features/classes/ClassCard'
import { ClassCardSkeleton } from '@/features/classes/ClassCardSkeleton'
import { CreateClassModal } from '@/features/classes/CreateClassModal'
import { JoinClassModal } from '@/features/classes/JoinClassModal'

export default function ClassListPage() {
  const { data: classes, isLoading } = useClassesQuery()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои классы</h1>
          <p className="mt-1 text-sm text-gray-500">Управляйте своими курсами и классами</p>
        </div>
        <div className="relative">
          <button
            data-testid="add-class-button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            + Добавить
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setShowCreateModal(true)
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Создать класс
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  setShowJoinModal(true)
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
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
        <div className="rounded-xl border-2 border-dashed border-gray-300 py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="mt-4 text-gray-500">У вас пока нет классов</p>
          <p className="mt-1 text-sm text-gray-400">Создайте класс или присоединитесь по коду</p>
        </div>
      )}

      {!isLoading && classes && classes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} />
          ))}
        </div>
      )}

      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  )
}
