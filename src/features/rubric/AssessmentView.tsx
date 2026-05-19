import type { AssessmentDto, RubricDto } from '@/types/dto'

interface Props {
  rubric: RubricDto
  assessment: AssessmentDto
}

const KIND_LABEL = {
  BOOLEAN: 'Да / нет',
  PERCENT: 'Проценты',
  SCORE: 'Балл',
} as const

export function AssessmentView({ rubric, assessment }: Props) {
  const byId = new Map(assessment.scores.map((s) => [s.criterionId, s]))

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-gray-600">Итоговая оценка</p>
        <p className="text-2xl font-bold text-green-800">
          {assessment.finalScore} / {rubric.totalMaxPoints}
          <span className="ml-2 text-base font-medium text-green-700">
            ({assessment.finalScoreNormalized}%)
          </span>
        </p>
      </div>

      <ul className="space-y-2">
        {rubric.criteria.map((c) => {
          const s = byId.get(c.id)
          if (!s) return null
          const value =
            c.kind === 'BOOLEAN'
              ? s.boolValue
                ? 'Да'
                : 'Нет'
              : c.kind === 'PERCENT'
                ? `${s.percentValue}%`
                : `${s.scoreValue} / ${c.scoreMax}`
          return (
            <li
              key={c.id}
              className={`rounded-lg border p-3 ${
                c.role === 'BONUS' ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{c.title}</p>
                  {c.description && (
                    <p className="mt-0.5 text-sm text-gray-600">{c.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {KIND_LABEL[c.kind]} ·{' '}
                    {c.role === 'PRIMARY' ? `до ${c.maxPoints} б.` : `коэф. до ${c.maxCoefficient}`}
                  </p>
                  {s.comment && (
                    <p className="mt-2 rounded-md bg-gray-50 px-2 py-1 text-sm text-gray-700">
                      {s.comment}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">
                    {c.role === 'PRIMARY'
                      ? `+${s.computedPoints} б.`
                      : `+${s.computedPoints} к мн.`}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
