import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useTeamsQuery } from '@/features/teams/hooks/useTeamsQuery'
import { useMyTeamsQuery } from '@/features/teams/hooks/useMyTeamsQuery'
import { TeamCard } from '@/features/teams/TeamCard'
import { MyTeamCard } from '@/features/teams/MyTeamCard'
import { CreateTeamModal } from '@/features/teams/CreateTeamModal'
import { ShuffleTeamsModal } from '@/features/teams/ShuffleTeamsModal'

export default function TeamListPage() {
  const { classId } = useParams<{ classId: string }>()
  const { data: classData, isLoading: classLoading } = useClassQuery(classId!)

  const isOwnerOrTeacher = classData?.myRole === 'OWNER' || classData?.myRole === 'TEACHER'
  const isStudent = classData?.myRole === 'STUDENT'

  const { data: teamsPage, isLoading: teamsLoading } = useTeamsQuery(classId!, undefined, 0, 100)
  const { data: myTeams, isLoading: myTeamsLoading } = useMyTeamsQuery(classId!, isStudent)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showShuffleModal, setShowShuffleModal] = useState(false)

  if (classLoading || teamsLoading || (isStudent && myTeamsLoading)) {
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

  const teams = teamsPage?.content ?? []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Команды</h1>
        {isOwnerOrTeacher && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShuffleModal(true)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Перемешать
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Создать команду
            </button>
          </div>
        )}
      </div>

      {isStudent && myTeams && myTeams.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">Мои команды</h2>
          <div className="space-y-3">
            {myTeams.map((team) => (
              <MyTeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {isOwnerOrTeacher && teams.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">Команды ещё не созданы</p>
        </div>
      )}

      {isOwnerOrTeacher && teams.length > 0 && (
        <div className="space-y-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} classId={classId!} />
          ))}
        </div>
      )}

      {isStudent && (!myTeams || myTeams.length === 0) && (
        <div className="py-12 text-center">
          <p className="text-gray-500">Вы пока не состоите ни в одной команде</p>
        </div>
      )}

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        classId={classId!}
      />

      <ShuffleTeamsModal
        isOpen={showShuffleModal}
        onClose={() => setShowShuffleModal(false)}
        classId={classId!}
      />
    </div>
  )
}
