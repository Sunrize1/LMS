import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useUpdateClassMutation } from '@/features/classes/hooks/useUpdateClassMutation'
import { useDeleteClassMutation } from '@/features/classes/hooks/useDeleteClassMutation'
import { useRegenerateCodeMutation } from '@/features/classes/hooks/useRegenerateCodeMutation'

export default function ClassSettingsPage() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const { data: classData, isLoading } = useClassQuery(classId!)
  const updateClass = useUpdateClassMutation(classId!)
  const { mutate: deleteClass } = useDeleteClassMutation()
  const regenerateCode = useRegenerateCodeMutation(classId!)
  const [copied, setCopied] = useState(false)
  const [className, setClassName] = useState('')

  useEffect(() => {
    if (classData?.name) {
      setClassName(classData.name)
    }
  }, [classData?.name])

  const handleCopy = async () => {
    if (classData?.code) {
      await navigator.clipboard.writeText(classData.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault()
    if (className.trim()) {
      updateClass.mutate({ name: className.trim() })
    }
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот класс? Это действие необратимо.')) {
      deleteClass(classId!, {
        onSuccess: () => navigate('/classes', { replace: true }),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (!classData) return null

  const isOwner = classData.myRole === 'OWNER'

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Настройки класса</h1>

      {/* Rename section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Название класса</h2>
        <form onSubmit={handleRename} className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="className" className="mb-1 block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              id="className"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={!className.trim() || updateClass.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {updateClass.isPending ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
        {updateClass.errorMessage && (
          <p className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {updateClass.errorMessage}
          </p>
        )}
      </div>

      {/* Invite code section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Пригласительный код</h2>
        <div className="flex items-center gap-3">
          <code className="rounded bg-gray-100 px-4 py-2 font-mono text-lg tracking-widest text-gray-900">
            {classData.code}
          </code>
          <button
            onClick={handleCopy}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {copied ? 'Скопировано!' : 'Скопировать'}
          </button>
          <button
            onClick={() => regenerateCode.mutate()}
            disabled={regenerateCode.isPending}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {regenerateCode.isPending ? 'Обновление...' : 'Обновить код'}
          </button>
        </div>
      </div>

      {/* Danger zone — only for OWNER */}
      {isOwner && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="mb-3 text-lg font-semibold text-red-900">Опасная зона</h2>
          <p className="mb-4 text-sm text-red-700">
            Удаление класса приведёт к потере всех заданий и ответов.
          </p>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Удалить класс
          </button>
        </div>
      )}
    </div>
  )
}
