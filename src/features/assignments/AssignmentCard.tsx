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
      className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
        {assignment.submissionStatus && (
          <StatusBadge status={assignment.submissionStatus} />
        )}
      </div>
      {assignment.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{assignment.description}</p>
      )}
    </Link>
  )
}
