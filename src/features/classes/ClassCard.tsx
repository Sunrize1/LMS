import { Link } from 'react-router-dom'
import { RoleBadge } from '@/components/RoleBadge'
import type { ClassDto } from '@/types/dto'

interface ClassCardProps {
  classItem: ClassDto
}

export function ClassCard({ classItem }: ClassCardProps) {
  return (
    <Link
      to={`/classes/${classItem.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
        <RoleBadge role={classItem.myRole} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>{classItem.memberCount} участников</span>
      </div>
    </Link>
  )
}
