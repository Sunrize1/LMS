import { useState } from 'react'
import { useRubricTemplatesQuery } from './hooks/useRubricTemplatesQuery'
import { useAttachRubricMutation } from './hooks/useRubricAttachmentMutations'
import {
  RubricTemplateEditor,
  emptyEditorState,
  primarySum,
  toCreateRequest,
  type EditorState,
} from './RubricTemplateEditor'
import { fromDecimal } from './domain/decimal'

interface Props {
  assignmentId: string
  classId: string
  onClose: () => void
}

type Tab = 'template' | 'adhoc'

export function AttachRubricModal({ assignmentId, classId, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('template')
  const [selectedId, setSelectedId] = useState<string>('')
  const [adhoc, setAdhoc] = useState<EditorState>(emptyEditorState())
  const { data: templates, isLoading } = useRubricTemplatesQuery(classId)
  const attach = useAttachRubricMutation(assignmentId)

  const adhocSum = primarySum(adhoc.criteria)
  const adhocValid =
    adhoc.name.trim().length > 0 &&
    fromDecimal(adhocSum) === fromDecimal(adhoc.totalMaxPoints) &&
    adhoc.criteria.every((c) => c.title.trim())

  const canSubmit =
    tab === 'template' ? !!selectedId : adhocValid

  const handleAttach = () => {
    const body =
      tab === 'template'
        ? { fromTemplateId: selectedId }
        : { adhoc: toCreateRequest(adhoc) }
    attach.mutate(body, { onSuccess: onClose })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-3xl rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Прикрепить рубрику</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-gray-200 px-5">
          <div className="flex gap-1 py-2">
            {([
              ['template', 'Из шаблона'],
              ['adhoc', 'Создать ad-hoc'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  tab === value
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {tab === 'template' ? (
            isLoading ? (
              <div className="h-24 animate-pulse rounded bg-gray-200" />
            ) : !templates || templates.length === 0 ? (
              <p className="text-sm text-gray-500">
                В этом классе пока нет шаблонов рубрики. Создайте шаблон во вкладке «Рубрики» или
                переключитесь на ad-hoc.
              </p>
            ) : (
              <div className="space-y-2">
                {templates.map((t) => (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      selectedId === t.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedId === t.id}
                      onChange={() => setSelectedId(t.id)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">
                        Макс. балл {t.totalMaxPoints} · критериев {t.criteriaCount}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )
          ) : (
            <RubricTemplateEditor value={adhoc} onChange={setAdhoc} />
          )}
        </div>

        {attach.errorMessage && (
          <div className="mx-5 mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {attach.errorMessage}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleAttach}
            disabled={!canSubmit || attach.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {attach.isPending ? 'Прикрепление...' : 'Прикрепить'}
          </button>
        </div>
      </div>
    </div>
  )
}
