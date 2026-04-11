import { useEffect, useState } from 'react'
import { useShuffleTeamsMutation } from './hooks/useShuffleTeamsMutation'
import { useMembersQuery } from '@/features/classes/hooks/useMembersQuery'

interface ShuffleTeamsModalProps {
  isOpen: boolean
  onClose: () => void
  classId: string
}

export function ShuffleTeamsModal({ isOpen, onClose, classId }: ShuffleTeamsModalProps) {
  const { mutate, isPending, errorMessage } = useShuffleTeamsMutation(classId)
  const { data: members } = useMembersQuery(classId)
  const studentCount = members?.filter((m) => m.role === 'STUDENT').length ?? 0

  const [teamCount, setTeamCount] = useState(2)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) setTeamCount(2)
  }, [isOpen])

  if (!isOpen) return null

  const studentsPerTeam = studentCount > 0 ? Math.ceil(studentCount / teamCount) : 0

  const handleShuffle = () => {
    mutate(
      { teamCount, strategy: 'RANDOM' },
      { onSuccess: () => onClose() },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Автоматическая разбивка</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="team-count" className="mb-1 block text-sm font-medium text-gray-700">
              Количество команд
            </label>
            <input
              id="team-count"
              type="number"
              min={2}
              max={studentCount}
              value={teamCount}
              onChange={(e) => setTeamCount(Math.max(2, parseInt(e.target.value) || 2))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm text-gray-600">
              {studentCount} учеников &rarr; {teamCount} команд по ~{studentsPerTeam} человек
            </p>
          </div>

          {errorMessage && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              onClick={handleShuffle}
              disabled={isPending || studentCount < 2}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Перемешивание...' : 'Перемешать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
