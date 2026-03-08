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
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-indigo-600">
            {classItem.name}
          </h3>
          <RoleBadge role={classItem.myRole} />
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{classItem.memberCount} участников</span>
        </div>
      </div>
    </Link>
  )
}
