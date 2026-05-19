import { useMemo } from 'react'
import type { CriterionTemplateInput, CreateRubricTemplateRequest } from '@/types/requests'
import { fromDecimal, toPoints } from './domain/decimal'

export interface EditorState {
  name: string
  description: string
  totalMaxPoints: string
  allowOvercap: boolean
  criteria: CriterionTemplateInput[]
}

export function emptyEditorState(): EditorState {
  return {
    name: '',
    description: '',
    totalMaxPoints: '10.00',
    allowOvercap: false,
    criteria: [newPrimary(0)],
  }
}

export function newPrimary(ordinal: number): CriterionTemplateInput {
  return {
    ordinal,
    title: '',
    description: '',
    kind: 'BOOLEAN',
    role: 'PRIMARY',
    maxPoints: '1.00',
    maxCoefficient: null,
    scoreMin: null,
    scoreMax: null,
  }
}

export function newBonus(ordinal: number): CriterionTemplateInput {
  return {
    ordinal,
    title: '',
    description: '',
    kind: 'BOOLEAN',
    role: 'BONUS',
    maxPoints: null,
    maxCoefficient: '1.1000',
    scoreMin: null,
    scoreMax: null,
  }
}

export function toCreateRequest(state: EditorState): CreateRubricTemplateRequest {
  return {
    name: state.name.trim(),
    description: state.description.trim() || null,
    totalMaxPoints: state.totalMaxPoints,
    allowOvercap: state.allowOvercap,
    criteria: state.criteria.map((c, i) => ({
      ...c,
      ordinal: i,
      title: c.title.trim(),
      description: c.description?.toString().trim() || null,
    })),
  }
}

export function primarySum(criteria: CriterionTemplateInput[]): string {
  const sum = criteria
    .filter((c) => c.role === 'PRIMARY')
    .reduce((acc, c) => acc + fromDecimal(c.maxPoints), 0)
  return toPoints(sum)
}

interface Props {
  value: EditorState
  onChange: (next: EditorState) => void
}

export function RubricTemplateEditor({ value, onChange }: Props) {
  const set = (patch: Partial<EditorState>) => onChange({ ...value, ...patch })

  const sumPrimary = useMemo(() => primarySum(value.criteria), [value.criteria])
  const matches = fromDecimal(sumPrimary) === fromDecimal(value.totalMaxPoints)

  const updateCriterion = (idx: number, patch: Partial<CriterionTemplateInput>) => {
    const next = value.criteria.map((c, i) => (i === idx ? normalize({ ...c, ...patch }) : c))
    set({ criteria: next })
  }

  const removeCriterion = (idx: number) => {
    if (value.criteria.length <= 1) return
    set({ criteria: value.criteria.filter((_, i) => i !== idx) })
  }

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= value.criteria.length) return
    const next = [...value.criteria]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    set({ criteria: next })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Название</label>
          <input
            value={value.name}
            onChange={(e) => set({ name: e.target.value })}
            maxLength={200}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Лабораторная — стандартная рубрика"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            value={value.description}
            onChange={(e) => set({ description: e.target.value })}
            maxLength={2000}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Максимальный балл
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1000"
              value={value.totalMaxPoints}
              onChange={(e) => set({ totalMaxPoints: e.target.value })}
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={value.allowOvercap}
              onChange={(e) => set({ allowOvercap: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            Разрешить превышение максимума за счёт бонусов
          </label>

          <div
            className={`ml-auto rounded-md px-3 py-1.5 text-sm font-medium ${
              matches ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            Σ основных: {sumPrimary} / {value.totalMaxPoints}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Критерии</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set({ criteria: [...value.criteria, newPrimary(value.criteria.length)] })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + основной
            </button>
            <button
              type="button"
              onClick={() => set({ criteria: [...value.criteria, newBonus(value.criteria.length)] })}
              className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
            >
              + бонус
            </button>
          </div>
        </div>

        {value.criteria.map((c, idx) => (
          <CriterionRow
            key={idx}
            criterion={c}
            index={idx}
            total={value.criteria.length}
            onChange={(patch) => updateCriterion(idx, patch)}
            onRemove={() => removeCriterion(idx)}
            onMove={(dir) => move(idx, dir)}
          />
        ))}
      </div>
    </div>
  )
}

function normalize(c: CriterionTemplateInput): CriterionTemplateInput {
  const next: CriterionTemplateInput = { ...c }
  if (next.role === 'PRIMARY') {
    next.maxCoefficient = null
    if (!next.maxPoints) next.maxPoints = '1.00'
  } else {
    next.maxPoints = null
    if (!next.maxCoefficient) next.maxCoefficient = '1.1000'
  }
  if (next.kind === 'SCORE') {
    if (!next.scoreMin) next.scoreMin = '0.00'
    if (!next.scoreMax) next.scoreMax = '5.00'
  } else {
    next.scoreMin = null
    next.scoreMax = null
  }
  return next
}

interface RowProps {
  criterion: CriterionTemplateInput
  index: number
  total: number
  onChange: (patch: Partial<CriterionTemplateInput>) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}

function CriterionRow({ criterion, index, total, onChange, onRemove, onMove }: RowProps) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
          >
            ▲
          </button>
          <span className="text-xs text-gray-400">#{index + 1}</span>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30"
          >
            ▼
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <input
            value={criterion.title}
            onChange={(e) => onChange({ title: e.target.value })}
            maxLength={200}
            placeholder="Название критерия"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <textarea
            value={criterion.description ?? ''}
            onChange={(e) => onChange({ description: e.target.value })}
            maxLength={2000}
            rows={2}
            placeholder="Описание (опционально)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex flex-wrap gap-4 text-sm">
            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Роль</legend>
              <Radio
                checked={criterion.role === 'PRIMARY'}
                onChange={() => onChange({ role: 'PRIMARY' })}
                label="Основной"
              />
              <Radio
                checked={criterion.role === 'BONUS'}
                onChange={() => onChange({ role: 'BONUS' })}
                label="Бонус"
              />
            </fieldset>

            <fieldset className="flex items-center gap-2">
              <legend className="sr-only">Тип</legend>
              <Radio
                checked={criterion.kind === 'BOOLEAN'}
                onChange={() => onChange({ kind: 'BOOLEAN' })}
                label="Да / нет"
              />
              <Radio
                checked={criterion.kind === 'PERCENT'}
                onChange={() => onChange({ kind: 'PERCENT' })}
                label="Проценты"
              />
              <Radio
                checked={criterion.kind === 'SCORE'}
                onChange={() => onChange({ kind: 'SCORE' })}
                label="Балл"
              />
            </fieldset>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            {criterion.role === 'PRIMARY' ? (
              <NumField
                label="Макс. баллов"
                value={criterion.maxPoints ?? ''}
                step="0.01"
                min="0.01"
                onChange={(v) => onChange({ maxPoints: v })}
              />
            ) : (
              <NumField
                label="Макс. коэффициент"
                value={criterion.maxCoefficient ?? ''}
                step="0.0001"
                min="1.0001"
                max="2"
                onChange={(v) => onChange({ maxCoefficient: v })}
              />
            )}

            {criterion.kind === 'SCORE' && (
              <>
                <NumField
                  label="Мин. значение"
                  value={criterion.scoreMin ?? ''}
                  step="0.01"
                  onChange={(v) => onChange({ scoreMin: v })}
                />
                <NumField
                  label="Макс. значение"
                  value={criterion.scoreMax ?? ''}
                  step="0.01"
                  onChange={(v) => onChange({ scoreMax: v })}
                />
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={total <= 1}
          className="rounded-lg border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          Удалить
        </button>
      </div>
    </div>
  )
}

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center gap-1.5">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-gray-300 text-indigo-600"
      />
      {label}
    </label>
  )
}

function NumField({
  label,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  step?: string
  min?: string
  max?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  )
}
