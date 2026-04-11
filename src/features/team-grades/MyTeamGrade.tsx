import { useMyTeamGradeQuery } from './hooks/useMyTeamGradeQuery'

interface MyTeamGradeProps {
  assignmentId: string
}

export function MyTeamGrade({ assignmentId }: MyTeamGradeProps) {
  const { data: grade, isLoading, isError } = useMyTeamGradeQuery(assignmentId)

  if (isLoading) {
    return <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
  }

  if (isError || !grade) return null

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Моя командная оценка</h2>
      <p className="text-sm text-gray-500">Команда: {grade.teamName}</p>
      <div className="mt-2 flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-500">Групповая: </span>
          <span className="font-medium text-gray-900">{grade.teamGrade}</span>
        </div>
        {grade.myAdjustment !== 0 && (
          <div className="text-sm">
            <span className="text-gray-500">Корректировка: </span>
            <span className={grade.myAdjustment > 0 ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
              {grade.myAdjustment > 0 ? '+' : ''}{grade.myAdjustment}
            </span>
          </div>
        )}
        <div className="text-sm">
          <span className="text-gray-500">Итого: </span>
          <span className="text-lg font-bold text-indigo-600">{grade.myFinalGrade}</span>
        </div>
      </div>
      {grade.comment && (
        <p className="mt-2 text-sm text-gray-600">Комментарий: {grade.comment}</p>
      )}
    </div>
  )
}
