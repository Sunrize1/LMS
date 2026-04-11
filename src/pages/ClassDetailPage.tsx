import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useAssignmentsQuery } from '@/features/assignments/hooks/useAssignmentsQuery'
import { ClassToolbar } from '@/features/classes/ClassToolbar'
import { AssignmentCard } from '@/features/assignments/AssignmentCard'
import { CreateAssignmentModal } from '@/features/assignments/CreateAssignmentModal'
import { QuickAssignmentForm } from '@/features/teams/QuickAssignmentForm'
import type { AssignmentType } from '@/types/dto'

type TypeFilter = 'ALL' | AssignmentType

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>()
  const { data: classData, isLoading: classLoading } = useClassQuery(classId!)
  const { data: assignments, isLoading: assignmentsLoading } = useAssignmentsQuery(classId!)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQuickForm, setShowQuickForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL')

  if (classLoading || assignmentsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  if (!classData) return null

  const isOwnerOrTeacher = classData.myRole === 'OWNER' || classData.myRole === 'TEACHER'

  return (
    <div>
      <ClassToolbar classData={classData} />

      {isOwnerOrTeacher && (
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            Создать задание
          </button>
          <button
            onClick={() => setShowQuickForm(!showQuickForm)}
            className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
          >
            + Быстрое задание
          </button>
        </div>
      )}

      {showQuickForm && isOwnerOrTeacher && (
        <div className="mb-4">
          <QuickAssignmentForm classId={classId!} onClose={() => setShowQuickForm(false)} />
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit">
          {([
            ['ALL', 'Все'],
            ['STANDARD', 'Стандартные'],
            ['QUICK', 'Быстрые'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value as TypeFilter)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                typeFilter === value
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {assignments && assignments.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">Заданий пока нет</p>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="space-y-3">
          {assignments
            .filter((a) => typeFilter === 'ALL' || a.type === typeFilter)
            .map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                classId={classId!}
              />
            ))}
        </div>
      )}

      <CreateAssignmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        classId={classId!}
      />
    </div>
  )
}
