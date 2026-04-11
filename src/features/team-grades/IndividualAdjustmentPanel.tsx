import { useState } from 'react'
import { useAdjustmentsQuery } from './hooks/useAdjustmentsQuery'
import { useUpdateAdjustmentMutation } from './hooks/useUpdateAdjustmentMutation'

interface IndividualAdjustmentPanelProps {
  assignmentId: string
  teamGradeId: string
  teamGrade: number
  isOwnerOrTeacher: boolean
}

export function IndividualAdjustmentPanel({
  assignmentId,
  teamGradeId,
  teamGrade,
  isOwnerOrTeacher,
}: IndividualAdjustmentPanelProps) {
  const { data: adjustments, isLoading } = useAdjustmentsQuery(assignmentId, teamGradeId)
  const updateAdj = useUpdateAdjustmentMutation(assignmentId, teamGradeId)

  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [adjValue, setAdjValue] = useState(0)
  const [adjComment, setAdjComment] = useState('')

  if (isLoading) {
    return <div className="ml-4 mt-2 h-16 animate-pulse rounded bg-gray-100" />
  }

  if (!adjustments || adjustments.length === 0) return null

  const handleSave = (studentId: string) => {
    updateAdj.mutate(
      { studentId, data: { adjustment: adjValue, comment: adjComment || undefined } },
      {
        onSuccess: () => {
          setEditingStudent(null)
          setAdjValue(0)
          setAdjComment('')
        },
      },
    )
  }

  return (
    <div className="ml-4 mt-1 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="mb-2 text-xs font-medium text-gray-500">
        Индивидуальные корректировки (итог = {teamGrade} + корректировка, 0-100)
      </div>
      <div className="space-y-2">
        {adjustments.map((adj) => (
          <div
            key={adj.studentId}
            className="flex items-center justify-between rounded-md bg-white px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">{adj.studentName}</span>
            </div>

            {editingStudent === adj.studentId && isOwnerOrTeacher ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gray-500">{teamGrade}</span>
                  <span className="text-gray-400">+</span>
                  <input
                    type="number"
                    min={-50}
                    max={50}
                    value={adjValue}
                    onChange={(e) => setAdjValue(parseInt(e.target.value) || 0)}
                    className="w-16 rounded border border-gray-300 px-1.5 py-0.5 text-center text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-gray-400">=</span>
                  <span className="font-medium text-gray-900">
                    {Math.max(0, Math.min(100, teamGrade + adjValue))}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Причина"
                  value={adjComment}
                  onChange={(e) => setAdjComment(e.target.value)}
                  className="w-32 rounded border border-gray-300 px-2 py-0.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSave(adj.studentId)}
                  disabled={updateAdj.isPending}
                  className="rounded bg-indigo-600 px-2 py-0.5 text-xs text-white hover:bg-indigo-700"
                >
                  OK
                </button>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-gray-500">{teamGrade}</span>
                  {adj.adjustment !== 0 && (
                    <span className={adj.adjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                      {' '}{adj.adjustment > 0 ? '+' : ''}{adj.adjustment}
                    </span>
                  )}
                  <span className="mx-1 text-gray-400">=</span>
                  <span className="font-medium text-gray-900">{adj.finalGrade}</span>
                </div>
                {adj.comment && (
                  <span className="text-xs text-gray-500" title={adj.comment}>
                    &middot; {adj.comment}
                  </span>
                )}
                {isOwnerOrTeacher && (
                  <button
                    onClick={() => {
                      setEditingStudent(adj.studentId)
                      setAdjValue(adj.adjustment)
                      setAdjComment(adj.comment ?? '')
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Изменить
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {updateAdj.errorMessage && (
        <p className="mt-2 text-xs text-red-600">{updateAdj.errorMessage}</p>
      )}
    </div>
  )
}
