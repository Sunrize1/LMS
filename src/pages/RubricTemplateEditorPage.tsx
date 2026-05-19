import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  RubricTemplateEditor,
  emptyEditorState,
  primarySum,
  toCreateRequest,
  type EditorState,
} from '@/features/rubric/RubricTemplateEditor'
import { useRubricTemplateQuery } from '@/features/rubric/hooks/useRubricTemplateQuery'
import {
  useCreateRubricTemplateMutation,
  useUpdateRubricTemplateMutation,
} from '@/features/rubric/hooks/useRubricTemplateMutations'
import type { CriterionTemplateInput } from '@/types/requests'
import type { CriterionTemplateDto } from '@/types/dto'
import { fromDecimal } from '@/features/rubric/domain/decimal'

function fromDto(criteria: CriterionTemplateDto[]): CriterionTemplateInput[] {
  return criteria.map((c) => ({
    ordinal: c.ordinal,
    title: c.title,
    description: c.description ?? '',
    kind: c.kind,
    role: c.role,
    maxPoints: c.maxPoints,
    maxCoefficient: c.maxCoefficient,
    scoreMin: c.scoreMin,
    scoreMax: c.scoreMax,
  }))
}

export default function RubricTemplateEditorPage() {
  const { classId, templateId } = useParams<{ classId: string; templateId?: string }>()
  const navigate = useNavigate()
  const isEdit = !!templateId
  const { data: template, isLoading } = useRubricTemplateQuery(templateId)
  const createMut = useCreateRubricTemplateMutation(classId!)
  const updateMut = useUpdateRubricTemplateMutation(templateId ?? '', classId)

  const [state, setState] = useState<EditorState>(emptyEditorState())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (isEdit && template && !hydrated) {
      setState({
        name: template.name,
        description: template.description ?? '',
        totalMaxPoints: template.totalMaxPoints,
        allowOvercap: template.allowOvercap,
        criteria: fromDto(template.criteria),
      })
      setHydrated(true)
    }
  }, [isEdit, template, hydrated])

  if (isEdit && isLoading) {
    return <div className="h-32 animate-pulse rounded bg-gray-200" />
  }

  const sum = primarySum(state.criteria)
  const sumMatches = fromDecimal(sum) === fromDecimal(state.totalMaxPoints)
  const canSave = state.name.trim().length > 0 && sumMatches && state.criteria.every((c) => c.title.trim())

  const handleSave = () => {
    const body = toCreateRequest(state)
    const onSuccess = () => navigate(`/classes/${classId}/rubric-templates`)
    if (isEdit) updateMut.mutate(body, { onSuccess })
    else createMut.mutate(body, { onSuccess })
  }

  const error = createMut.errorMessage || updateMut.errorMessage
  const saving = createMut.isPending || updateMut.isPending

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/classes/${classId}/rubric-templates`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          &larr; К списку шаблонов
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {isEdit ? 'Редактирование шаблона' : 'Новый шаблон рубрики'}
        </h1>
      </div>

      <RubricTemplateEditor value={state} onChange={setState} />

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate(`/classes/${classId}/rubric-templates`)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {!sumMatches && (
        <p className="mt-2 text-right text-xs text-red-600">
          Сумма баллов основных критериев должна совпадать с максимальным баллом
        </p>
      )}
    </div>
  )
}
