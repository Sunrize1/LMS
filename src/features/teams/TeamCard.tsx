import { Link } from 'react-router-dom'
import type { TeamListItemDto } from '@/types/dto'

interface TeamCardProps {
  team: TeamListItemDto
  classId: string
}

export function TeamCard({ team, classId }: TeamCardProps) {
  return (
    <Link
      to={`/classes/${classId}/teams/${team.id}`}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 transition group-hover:text-indigo-600">
            {team.name}
          </h3>
          <div className="flex items-center gap-2">
            {team.assignmentId ? (
              <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                Временная
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                Постоянная
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {team.memberCount} участн. &middot; Лидер: {team.leaderName}
        </p>
      </div>
    </Link>
  )
}
