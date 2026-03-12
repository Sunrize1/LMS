import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGradeMutation } from '@/features/submissions/hooks/useGradeMutation'
import type { SubmissionDto } from '@/types/dto'

export default function SubmissionDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const submission = location.state as SubmissionDto | undefined
  const gradeMutation = useGradeMutation(submission?.id ?? '')
  const [grade, setGrade] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  if (!submission) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-gray-500">Данные ответа не найдены.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          &larr; Назад
        </button>
      </div>
    )
  }

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault()
    const gradeNum = parseInt(grade, 10)
    if (!isNaN(gradeNum)) {
      gradeMutation.mutate({ grade: gradeNum })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        &larr; Назад к заданию
      </button>

      <h1 className="mb-4 text-2xl font-bold text-gray-900">{submission.studentName}</h1>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Ответ</h2>
        {submission.answerText && (
          <p className="text-gray-700">{submission.answerText}</p>
        )}
        {submission.fileUrls && submission.fileUrls.length > 0 && (
          <div className="mt-2 space-y-1">
            {submission.fileUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                className="block text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Файл {i + 1}
              </a>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-gray-400">
          Отправлено: {new Date(submission.submittedAt).toLocaleString('ru-RU')}
        </p>
      </div>

      {submission.grade !== null && !isEditing ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-green-700">Оценка: {submission.grade}</p>
            <button
              onClick={() => {
                setGrade(String(submission.grade))
                setIsEditing(true)
              }}
              className="rounded-lg border border-green-300 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
            >
              Изменить
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleGrade} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            {isEditing ? 'Изменить оценку' : 'Оценить работу'}
          </h2>
          <div className="flex items-end gap-3">
            <div>
              <label htmlFor="grade" className="mb-1 block text-sm font-medium text-gray-700">
                Оценка (0–100)
              </label>
              <input
                id="grade"
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={!grade || gradeMutation.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {gradeMutation.isPending ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Поставить оценку'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setGrade('')
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Отмена
              </button>
            )}
          </div>

          {gradeMutation.errorMessage && (
            <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {gradeMutation.errorMessage}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
