import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyAssessmentsQuery } from '@/features/rubric/hooks/useAssessmentQueries'
import type { MyAssessmentDto } from '@/types/dto'

const KIND_LABEL = {
  BOOLEAN: 'Да / нет',
  PERCENT: 'Проценты',
  SCORE: 'Балл',
} as const

export default function MyGradesPage() {
  const { data, isLoading, isError } = useMyAssessmentsQuery()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="text-sm text-red-600">Не удалось загрузить оценки.</p>
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Мои оценки</h1>

      {!data || data.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">Оценок по рубрикам пока нет</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((a) => (
            <AssessmentCard
              key={a.assessmentId}
              data={a}
              open={expanded.has(a.assessmentId)}
              onToggle={() => toggle(a.assessmentId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AssessmentCard({
  data,
  open,
  onToggle,
}: {
  data: MyAssessmentDto
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div>
          <p className="font-medium text-gray-900">{data.assignmentTitle}</p>
          <p className="text-sm text-gray-500">
            {data.finalScore} / {data.totalMaxPoints} ({data.finalScoreNormalized}%)
          </p>
        </div>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3">
          <ul className="space-y-2">
            {data.criteria.map((c, i) => {
              const value =
                c.kind === 'BOOLEAN'
                  ? c.value
                    ? 'Да'
                    : 'Нет'
                  : c.kind === 'PERCENT'
                    ? `${c.value}%`
                    : `${c.value} / ${c.scoreMax}`
              return (
                <li
                  key={i}
                  className={`rounded-lg border p-3 text-sm ${
                    c.role === 'BONUS'
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">
                        {KIND_LABEL[c.kind]} ·{' '}
                        {c.role === 'PRIMARY'
                          ? `до ${c.maxPoints} б.`
                          : `коэф. до ${c.maxCoefficient}`}
                      </p>
                      {c.comment && (
                        <p className="mt-2 rounded-md bg-white px-2 py-1 text-gray-700">
                          {c.comment}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500">
                        {c.role === 'PRIMARY'
                          ? `+${c.computedPoints} б.`
                          : `+${c.computedPoints} к мн.`}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-3 text-right">
            <Link
              to={`/classes/${data.assignmentId}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              К заданию →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
