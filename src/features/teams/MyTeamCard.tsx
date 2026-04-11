import type { TeamDto } from '@/types/dto'

interface MyTeamCardProps {
  team: TeamDto
}

export function MyTeamCard({ team }: MyTeamCardProps) {
  const leader = team.members.find((m) => m.isLeader)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{team.name}</h3>
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
      {leader && (
        <p className="mt-1 text-sm text-gray-500">Лидер: {leader.firstName} {leader.lastName}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {team.members.map((member) => (
          <span
            key={member.userId}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              member.isLeader ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {member.firstName} {member.lastName}
          </span>
        ))}
      </div>
    </div>
  )
}
