import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useTeamQuery } from '@/features/teams/hooks/useTeamQuery'
import { useUpdateTeamMutation } from '@/features/teams/hooks/useUpdateTeamMutation'
import { useDeleteTeamMutation } from '@/features/teams/hooks/useDeleteTeamMutation'
import { useRemoveTeamMemberMutation } from '@/features/teams/hooks/useRemoveTeamMemberMutation'
import { useAddTeamMemberMutation } from '@/features/teams/hooks/useAddTeamMemberMutation'
import { useMembersQuery } from '@/features/classes/hooks/useMembersQuery'

export default function TeamDetailPage() {
  const { classId, teamId } = useParams<{ classId: string; teamId: string }>()
  const navigate = useNavigate()
  const { data: classData } = useClassQuery(classId!)
  const { data: team, isLoading } = useTeamQuery(classId!, teamId!)
  const updateTeam = useUpdateTeamMutation(classId!, teamId!)
  const deleteTeam = useDeleteTeamMutation(classId!)
  const removeMember = useRemoveTeamMemberMutation(classId!, teamId!)
  const addMember = useAddTeamMemberMutation(classId!, teamId!)
  const { data: allMembers } = useMembersQuery(classId!)

  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const isOwnerOrTeacher = classData?.myRole === 'OWNER' || classData?.myRole === 'TEACHER'

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-40 animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (!team) return null

  const handleSaveName = () => {
    if (editName.trim() && editName !== team.name) {
      updateTeam.mutate({ name: editName.trim() })
    }
    setIsEditingName(false)
  }

  const handleDelete = () => {
    if (window.confirm(`Удалить команду "${team.name}"?`)) {
      deleteTeam.mutate(teamId!, {
        onSuccess: () => navigate(`/classes/${classId}/teams`),
      })
    }
  }

  const handleSetLeader = (userId: string) => {
    updateTeam.mutate({ leaderUserId: userId })
  }

  const handleRemoveMember = (userId: string, name: string) => {
    if (window.confirm(`Убрать ${name} из команды?`)) {
      removeMember.mutate(userId)
    }
  }

  const handleAddMember = () => {
    if (!selectedUserId) return
    addMember.mutate(
      { userId: selectedUserId, isLeader: false },
      { onSuccess: () => { setShowAddMember(false); setSelectedUserId('') } },
    )
  }

  const teamMemberIds = new Set(team.members.map((m) => m.userId))
  const availableStudents = allMembers?.filter(
    (m) => m.role === 'STUDENT' && !teamMemberIds.has(m.userId),
  ) ?? []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xl font-bold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
            >
              Сохранить
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
          </div>
        ) : (
          <h1
            className={`text-2xl font-bold text-gray-900 ${isOwnerOrTeacher ? 'cursor-pointer hover:text-indigo-600' : ''}`}
            onClick={() => {
              if (isOwnerOrTeacher) {
                setEditName(team.name)
                setIsEditingName(true)
              }
            }}
          >
            {team.name}
          </h1>
        )}

        {isOwnerOrTeacher && (
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Удалить команду
          </button>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        {team.assignmentId ? (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
            Временная (на задание)
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Постоянная
          </span>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Участники ({team.members.length})</h2>
          {isOwnerOrTeacher && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Добавить участника
            </button>
          )}
        </div>

        {showAddMember && (
          <div className="border-b border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Выберите ученика...</option>
                {availableStudents.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddMember}
                disabled={!selectedUserId || addMember.isPending}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {addMember.isPending ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
            {addMember.errorMessage && (
              <p className="mt-2 text-sm text-red-600">{addMember.errorMessage}</p>
            )}
          </div>
        )}

        {team.members.map((member, idx) => (
          <div
            key={member.userId}
            className={`flex items-center justify-between p-4 ${
              idx < team.members.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {member.firstName} {member.lastName}
                </p>
                {member.isLeader && (
                  <span className="text-xs font-medium text-purple-600">Лидер</span>
                )}
              </div>
            </div>

            {isOwnerOrTeacher && (
              <div className="flex items-center gap-2">
                {!member.isLeader && (
                  <button
                    onClick={() => handleSetLeader(member.userId)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    Назначить лидером
                  </button>
                )}
                <button
                  onClick={() => handleRemoveMember(member.userId, `${member.firstName} ${member.lastName}`)}
                  className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Убрать
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {(updateTeam.errorMessage || deleteTeam.errorMessage || removeMember.errorMessage) && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {updateTeam.errorMessage || deleteTeam.errorMessage || removeMember.errorMessage}
        </p>
      )}
    </div>
  )
}
