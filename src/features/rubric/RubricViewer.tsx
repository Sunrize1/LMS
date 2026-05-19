import type { RubricDto } from '@/types/dto'

const KIND_LABEL = {
  BOOLEAN: 'Да / нет',
  PERCENT: 'Проценты',
  SCORE: 'Балл',
} as const

interface Props {
  rubric: RubricDto
}

export function RubricViewer({ rubric }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Рубрика оценивания</h3>
          {rubric.description && (
            <p className="mt-1 text-sm text-gray-600">{rubric.description}</p>
          )}
        </div>
        <div className="text-right text-sm text-gray-500">
          Макс. балл <span className="font-medium text-gray-900">{rubric.totalMaxPoints}</span>
          {rubric.allowOvercap && <span className="ml-2 text-amber-600">(c превышением)</span>}
        </div>
      </div>

      <ul className="space-y-2">
        {rubric.criteria.map((c) => (
          <li
            key={c.id}
            className={`rounded-lg border p-3 ${
              c.role === 'BONUS' ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  <span className="mr-2 text-gray-400">#{c.ordinal + 1}</span>
                  {c.title}
                </p>
                {c.description && (
                  <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {KIND_LABEL[c.kind]}
                  {c.kind === 'SCORE' && ` (${c.scoreMin} – ${c.scoreMax})`}
                </p>
              </div>
              <div className="text-right text-sm">
                {c.role === 'PRIMARY' ? (
                  <span className="font-semibold text-gray-900">до {c.maxPoints} б.</span>
                ) : (
                  <span className="font-semibold text-amber-700">× {c.maxCoefficient}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
