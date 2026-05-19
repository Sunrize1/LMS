import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useRubricTemplatesQuery } from '@/features/rubric/hooks/useRubricTemplatesQuery'
import {
  useDeleteRubricTemplateMutation,
  useImportRubricTemplateMutation,
} from '@/features/rubric/hooks/useRubricTemplateMutations'
import { apiRubricTemplates } from '@/services/apiRubricTemplates'

function slug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'rubric'
}

export default function RubricTemplatesPage() {
  const { classId } = useParams<{ classId: string }>()
  const { data: classData, isLoading: classLoading } = useClassQuery(classId!)
  const { data: templates, isLoading } = useRubricTemplatesQuery(classId!)
  const del = useDeleteRubricTemplateMutation(classId!)
  const importMut = useImportRubricTemplateMutation(classId!)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const isOwnerOrTeacher =
    classData?.myRole === 'OWNER' || classData?.myRole === 'TEACHER'

  if (classLoading || isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    )
  }

  const handleExport = async (id: string, name: string) => {
    setBusyId(id)
    try {
      const blob = await apiRubricTemplates.exportTemplate(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rubric-${slug(name)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setBusyId(null)
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    importMut.mutate(file)
  }

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Удалить шаблон «${name}»?`)) return
    del.mutate(id)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to={`/classes/${classId}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            &larr; К классу
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Шаблоны рубрик</h1>
        </div>
        {isOwnerOrTeacher && (
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImport}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importMut.isPending}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {importMut.isPending ? 'Импорт...' : 'Импортировать'}
            </button>
            <Link
              to={`/classes/${classId}/rubric-templates/new`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Создать шаблон
            </Link>
          </div>
        )}
      </div>

      {(importMut.errorMessage || del.errorMessage) && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {importMut.errorMessage || del.errorMessage}
        </div>
      )}

      {!templates || templates.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">Шаблонов пока нет</p>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
            >
              <Link
                to={`/classes/${classId}/rubric-templates/${t.id}`}
                className="flex-1 hover:underline"
              >
                <p className="font-medium text-gray-900">{t.name}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Макс. балл {t.totalMaxPoints} · критериев {t.criteriaCount}
                </p>
              </Link>
              {isOwnerOrTeacher && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport(t.id, t.name)}
                    disabled={busyId === t.id}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Экспорт
                  </button>
                  <Link
                    to={`/classes/${classId}/rubric-templates/${t.id}`}
                    className="rounded-md border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    Открыть
                  </Link>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    disabled={del.isPending}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
