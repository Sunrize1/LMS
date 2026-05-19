import { useMemo, useState } from 'react'
import type { RubricDto, AssessmentDto, CriterionDto } from '@/types/dto'
import type { CriterionScoreInput } from '@/types/requests'
import { calculate } from './domain/calculator'
import { fromDecimal } from './domain/decimal'
import {
  useCreateAssessmentMutation,
  useUpdateAssessmentMutation,
  useDeleteAssessmentMutation,
} from './hooks/useAssessmentMutations'

interface Props {
  rubric: RubricDto
  assignmentId: string
  submissionId?: string
  teamId?: string
  teamGradeId?: string
  existing?: AssessmentDto | null
  onSaved?: () => void
}

type ScoreState = Record<string, CriterionScoreInput>

function emptyScoresFor(rubric: RubricDto): ScoreState {
  const state: ScoreState = {}
  for (const c of rubric.criteria) {
    state[c.id] = { criterionId: c.id, comment: '' }
    if (c.kind === 'BOOLEAN') state[c.id].boolValue = false
    else if (c.kind === 'PERCENT') state[c.id].percentValue = '0'
    else state[c.id].scoreValue = c.scoreMin ?? '0'
  }
  return state
}

function hydrateFrom(rubric: RubricDto, existing: AssessmentDto): ScoreState {
  const state = emptyScoresFor(rubric)
  for (const s of existing.scores) {
    state[s.criterionId] = {
      criterionId: s.criterionId,
      boolValue: s.boolValue,
      percentValue: s.percentValue,
      scoreValue: s.scoreValue,
      comment: s.comment ?? '',
    }
  }
  return state
}

function isScoreValid(c: CriterionDto, s: CriterionScoreInput): boolean {
  if (c.kind === 'BOOLEAN') return typeof s.boolValue === 'boolean'
  if (c.kind === 'PERCENT') {
    const v = fromDecimal(s.percentValue ?? null)
    return v >= 0 && v <= 100
  }
  const v = fromDecimal(s.scoreValue ?? null)
  const min = fromDecimal(c.scoreMin)
  const max = fromDecimal(c.scoreMax)
  return v >= min && v <= max
}

export function AssessmentForm({
  rubric,
  assignmentId,
  submissionId,
  teamId,
  teamGradeId,
  existing,
  onSaved,
}: Props) {
  const [scores, setScores] = useState<ScoreState>(() =>
    existing ? hydrateFrom(rubric, existing) : emptyScoresFor(rubric),
  )

  const createMut = useCreateAssessmentMutation({
    assignmentId,
    submissionId,
    teamId,
    teamGradeId,
  })
  const updateMut = useUpdateAssessmentMutation({
    assignmentId,
    submissionId,
    teamId,
    teamGradeId,
    assessmentId: existing?.id ?? '',
  })
  const deleteMut = useDeleteAssessmentMutation({
    assignmentId,
    submissionId,
    teamId,
    teamGradeId,
  })

  const scoreList = useMemo(() => rubric.criteria.map((c) => scores[c.id]), [rubric, scores])
  const calc = useMemo(() => calculate(rubric, scoreList), [rubric, scoreList])

  const allValid = rubric.criteria.every((c) => isScoreValid(c, scores[c.id]))

  const handleSave = () => {
    const payload = {
      scores: rubric.criteria.map((c) => {
        const s = scores[c.id]
        return {
          criterionId: c.id,
          boolValue: c.kind === 'BOOLEAN' ? !!s.boolValue : null,
          percentValue: c.kind === 'PERCENT' ? s.percentValue : null,
          scoreValue: c.kind === 'SCORE' ? s.scoreValue : null,
          comment: s.comment?.toString().trim() || null,
        }
      }),
    }
    const opts = { onSuccess: () => onSaved?.() }
    if (existing) {
      updateMut.mutate(payload, opts)
    } else {
      createMut.mutate(
        {
          submissionId: submissionId ?? null,
          teamId: teamId ?? null,
          teamGradeId: teamGradeId ?? null,
          ...payload,
        },
        opts,
      )
    }
  }

  const handleDelete = () => {
    if (!existing) return
    if (!window.confirm('Снять оценивание?')) return
    deleteMut.mutate(existing.id, { onSuccess: () => onSaved?.() })
  }

  const update = (id: string, patch: Partial<CriterionScoreInput>) =>
    setScores((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const saving = createMut.isPending || updateMut.isPending
  const error = createMut.errorMessage || updateMut.errorMessage || deleteMut.errorMessage

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {existing ? 'Изменить оценивание' : 'Оценить по рубрике'}
      </h3>

      <ul className="space-y-3">
        {rubric.criteria.map((c) => {
          const s = scores[c.id]
          const valid = isScoreValid(c, s)
          return (
            <li
              key={c.id}
              className={`rounded-xl border p-4 ${
                c.role === 'BONUS' ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
              } ${!valid ? 'ring-1 ring-red-400' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{c.title}</p>
                  {c.description && (
                    <p className="mt-1 text-sm text-gray-600">{c.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {c.role === 'PRIMARY' ? `до ${c.maxPoints} б.` : `коэф. до ${c.maxCoefficient}`}
                    {c.kind === 'SCORE' && ` · диапазон ${c.scoreMin}–${c.scoreMax}`}
                  </p>
                </div>
                <div className="text-right text-sm font-medium text-gray-700">
                  {c.role === 'PRIMARY'
                    ? `+${calc.computedPoints.get(c.id) ?? '0.00'} б.`
                    : `+${calc.computedPoints.get(c.id) ?? '0.0000'} к мн.`}
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {c.kind === 'BOOLEAN' && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!s.boolValue}
                      onChange={(e) => update(c.id, { boolValue: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                    />
                    Зачтено
                  </label>
                )}
                {c.kind === 'PERCENT' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={fromDecimal(s.percentValue ?? '0')}
                      onChange={(e) => update(c.id, { percentValue: e.target.value })}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={s.percentValue ?? '0'}
                      onChange={(e) => update(c.id, { percentValue: e.target.value })}
                      className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                )}
                {c.kind === 'SCORE' && (
                  <input
                    type="number"
                    min={c.scoreMin ?? undefined}
                    max={c.scoreMax ?? undefined}
                    step="0.01"
                    value={s.scoreValue ?? ''}
                    onChange={(e) => update(c.id, { scoreValue: e.target.value })}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                  />
                )}
                <textarea
                  value={s.comment ?? ''}
                  onChange={(e) => update(c.id, { comment: e.target.value })}
                  maxLength={500}
                  rows={1}
                  placeholder="Комментарий (опционально)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </li>
          )
        })}
      </ul>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600">Итоговая оценка</p>
            <p className="text-2xl font-bold text-indigo-900">
              {calc.finalScore} / {rubric.totalMaxPoints}
              <span className="ml-2 text-base font-medium text-indigo-700">
                ({calc.finalScoreNormalized}%)
              </span>
            </p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Основные: {calc.primarySum}</p>
            <p>Множитель: × {calc.bonusMultiplier}</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center justify-end gap-2">
        {existing && (
          <button
            onClick={handleDelete}
            disabled={deleteMut.isPending}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleteMut.isPending ? 'Удаление...' : 'Снять оценивание'}
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!allValid || saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : existing ? 'Сохранить' : 'Поставить оценку'}
        </button>
      </div>
    </div>
  )
}
