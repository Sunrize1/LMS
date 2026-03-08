import { Link } from 'react-router-dom'
import type { ClassDto } from '@/types/dto'

interface ClassToolbarProps {
  classData: ClassDto
}

export function ClassToolbar({ classData }: ClassToolbarProps) {
  const isOwnerOrTeacher = classData.myRole === 'OWNER' || classData.myRole === 'TEACHER'

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Код: {classData.code}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to={`/classes/${classData.id}/members`}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Участники
        </Link>
        {isOwnerOrTeacher && (
          <Link
            to={`/classes/${classData.id}/settings`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Настройки
          </Link>
        )}
      </div>
    </div>
  )
}
