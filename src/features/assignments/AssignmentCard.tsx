import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import type { AssignmentDto } from '@/types/dto'

interface AssignmentCardProps {
  assignment: AssignmentDto
  classId: string
}

export function AssignmentCard({ assignment, classId }: AssignmentCardProps) {
  return (
    <Link
      to={`/classes/${classId}/assignments/${assignment.id}`}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 transition group-hover:text-indigo-600">
            {assignment.title}
          </h3>
          {assignment.submissionStatus && (
            <StatusBadge status={assignment.submissionStatus} />
          )}
        </div>
        {assignment.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
        )}
      </div>
    </Link>
  )
}
