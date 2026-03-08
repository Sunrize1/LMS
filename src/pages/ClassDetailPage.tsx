import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useAssignmentsQuery } from '@/features/assignments/hooks/useAssignmentsQuery'
import { ClassToolbar } from '@/features/classes/ClassToolbar'
import { AssignmentCard } from '@/features/assignments/AssignmentCard'
import { CreateAssignmentModal } from '@/features/assignments/CreateAssignmentModal'

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>()
  const { data: classData, isLoading: classLoading } = useClassQuery(classId!)
  const { data: assignments, isLoading: assignmentsLoading } = useAssignmentsQuery(classId!)
  const [showCreateModal, setShowCreateModal] = useState(false)

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
        <div className="mb-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Создать задание
          </button>
        </div>
      )}

      {assignments && assignments.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">Заданий пока нет</p>
        </div>
      )}

      {assignments && assignments.length > 0 && (
        <div className="space-y-3">
          {assignments.map((assignment) => (
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
