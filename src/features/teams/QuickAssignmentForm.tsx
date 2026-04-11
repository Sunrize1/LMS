import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuickAssignmentMutation } from './hooks/useQuickAssignmentMutation'
import { useTeamsQuery } from './hooks/useTeamsQuery'

interface QuickAssignmentFormProps {
  classId: string
  onClose: () => void
}

export function QuickAssignmentForm({ classId, onClose }: QuickAssignmentFormProps) {
  const navigate = useNavigate()
  const { mutate, isPending, errorMessage } = useQuickAssignmentMutation(classId)
  const { data: teamsPage } = useTeamsQuery(classId)

  const [title, setTitle] = useState('')
  const [isTeamBased, setIsTeamBased] = useState(false)
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

  const teams = teamsPage?.content ?? []

  const toggleTeam = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    mutate(
      {
        title: title.trim(),
        isTeamBased,
        teamIds: isTeamBased && selectedTeamIds.length > 0 ? selectedTeamIds : undefined,
      },
      {
        onSuccess: (data) => {
          onClose()
          navigate(`/classes/${classId}/assignments/${data.id}`)
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-indigo-900">Быстрое задание</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название задания..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
          }}
        />

        <div className="flex items-center gap-2">
          <input
            id="team-based"
            type="checkbox"
            checked={isTeamBased}
            onChange={(e) => {
              setIsTeamBased(e.target.checked)
              if (!e.target.checked) setSelectedTeamIds([])
            }}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="team-based" className="text-sm text-gray-700">
            Командное задание
          </label>
        </div>

        {isTeamBased && teams.length > 0 && (
          <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-white">
            {teams.map((team) => (
              <label
                key={team.id}
                className="flex cursor-pointer items-center gap-2 border-b border-gray-100 px-3 py-1.5 last:border-b-0 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedTeamIds.includes(team.id)}
                  onChange={() => toggleTeam(team.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm text-gray-900">{team.name}</span>
              </label>
            ))}
          </div>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!title.trim() || isPending}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Создание...' : 'Создать'}
          </button>
        </div>
      </div>
    </form>
  )
}
