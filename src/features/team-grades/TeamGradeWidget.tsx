import { useState } from 'react'
import { useTeamGradesQuery } from './hooks/useTeamGradesQuery'
import { useCreateTeamGradeMutation } from './hooks/useCreateTeamGradeMutation'
import { useUpdateTeamGradeMutation } from './hooks/useUpdateTeamGradeMutation'
import { useTeamsQuery } from '@/features/teams/hooks/useTeamsQuery'
import { IndividualAdjustmentPanel } from './IndividualAdjustmentPanel'

interface TeamGradeWidgetProps {
  assignmentId: string
  classId: string
  isOwnerOrTeacher: boolean
}

export function TeamGradeWidget({ assignmentId, classId, isOwnerOrTeacher }: TeamGradeWidgetProps) {
  const { data: teamGrades, isLoading: gradesLoading } = useTeamGradesQuery(assignmentId)
  const { data: teamsPage } = useTeamsQuery(classId)
  const createGrade = useCreateTeamGradeMutation(assignmentId)
  const updateGrade = useUpdateTeamGradeMutation(assignmentId)

  const [gradeInputs, setGradeInputs] = useState<Record<string, { grade: string; comment: string }>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedGradeId, setExpandedGradeId] = useState<string | null>(null)

  const grades = teamGrades?.content ?? []
  const teams = teamsPage?.content ?? []
  const gradedTeamIds = new Set(grades.map((g) => g.teamId))
  const ungradedTeams = teams.filter((t) => !gradedTeamIds.has(t.id))

  const handleGrade = (teamId: string) => {
    const input = gradeInputs[teamId]
    if (!input) return
    const grade = parseInt(input.grade)
    if (isNaN(grade) || grade < 0 || grade > 100) return

    createGrade.mutate(
      { teamId, grade, comment: input.comment || undefined },
      {
        onSuccess: () => {
          setGradeInputs((prev) => {
            const next = { ...prev }
            delete next[teamId]
            return next
          })
        },
      },
    )
  }

  const handleUpdateGrade = (teamGradeId: string) => {
    const input = gradeInputs[teamGradeId]
    if (!input) return
    const grade = parseInt(input.grade)
    if (isNaN(grade) || grade < 0 || grade > 100) return

    updateGrade.mutate(
      { teamGradeId, data: { grade, comment: input.comment || undefined } },
      { onSuccess: () => setEditingId(null) },
    )
  }

  if (gradesLoading) {
    return <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
  }

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Командные оценки</h2>

      {grades.length > 0 && (
        <div className="mb-4 space-y-2">
          {grades.map((g) => (
            <div key={g.id}>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{g.teamName}</span>
                    <span className="ml-2 text-sm text-gray-500">({g.memberCount} участн.)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {editingId === g.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={gradeInputs[g.id]?.grade ?? g.grade}
                          onChange={(e) =>
                            setGradeInputs((prev) => ({
                              ...prev,
                              [g.id]: { grade: e.target.value, comment: prev[g.id]?.comment ?? '' },
                            }))
                          }
                          className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateGrade(g.id)}
                          disabled={updateGrade.isPending}
                          className="rounded-md bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          {g.grade}
                        </span>
                        {isOwnerOrTeacher && (
                          <button
                            onClick={() => {
                              setEditingId(g.id)
                              setGradeInputs((prev) => ({
                                ...prev,
                                [g.id]: { grade: String(g.grade), comment: '' },
                              }))
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            Изменить
                          </button>
                        )}
                      </>
                    )}
                    {isOwnerOrTeacher && (
                      <button
                        onClick={() => setExpandedGradeId(expandedGradeId === g.id ? null : g.id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        {expandedGradeId === g.id ? 'Свернуть' : 'Корректировки'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {expandedGradeId === g.id && (
                <IndividualAdjustmentPanel
                  assignmentId={assignmentId}
                  teamGradeId={g.id}
                  teamGrade={g.grade}
                  isOwnerOrTeacher={isOwnerOrTeacher}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isOwnerOrTeacher && ungradedTeams.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Без оценки</h3>
          {ungradedTeams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4"
            >
              <div>
                <span className="font-medium text-gray-700">{team.name}</span>
                <span className="ml-2 text-sm text-gray-500">({team.memberCount} участн.)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0-100"
                  value={gradeInputs[team.id]?.grade ?? ''}
                  onChange={(e) =>
                    setGradeInputs((prev) => ({
                      ...prev,
                      [team.id]: { grade: e.target.value, comment: prev[team.id]?.comment ?? '' },
                    }))
                  }
                  className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Комментарий"
                  value={gradeInputs[team.id]?.comment ?? ''}
                  onChange={(e) =>
                    setGradeInputs((prev) => ({
                      ...prev,
                      [team.id]: { grade: prev[team.id]?.grade ?? '', comment: e.target.value },
                    }))
                  }
                  className="w-40 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={() => handleGrade(team.id)}
                  disabled={createGrade.isPending || !gradeInputs[team.id]?.grade}
                  className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Оценить
                </button>
              </div>
            </div>
          ))}
          {createGrade.errorMessage && (
            <p className="text-sm text-red-600">{createGrade.errorMessage}</p>
          )}
        </div>
      )}

      {grades.length === 0 && ungradedTeams.length === 0 && (
        <p className="text-sm text-gray-500">Нет команд для оценки</p>
      )}
    </div>
  )
}
