import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSubmissionQuery } from '@/features/submissions/hooks/useSubmissionQuery'
import { useGradeMutation } from '@/features/submissions/hooks/useGradeMutation'

export default function SubmissionDetailPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const { data: submission, isLoading } = useSubmissionQuery(submissionId!)
  const gradeMutation = useGradeMutation(submissionId!)
  const [grade, setGrade] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-20 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!submission) return null

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault()
    const gradeNum = parseInt(grade, 10)
    if (!isNaN(gradeNum)) {
      gradeMutation.mutate({ grade: gradeNum })
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{submission.studentName}</h1>

      <div className="mb-6 rounded-lg border border-gray-200 p-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Ответ</h2>
        {submission.answerText && (
          <p className="text-gray-700">{submission.answerText}</p>
        )}
        {submission.fileUrl && (
          <a
            href={submission.fileUrl}
            className="mt-2 inline-block text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Скачать файл
          </a>
        )}
      </div>

      {submission.grade !== null ? (
        <p className="text-lg font-medium text-green-600">Оценка: {submission.grade}</p>
      ) : (
        <form onSubmit={handleGrade} className="space-y-4">
          <div>
            <label htmlFor="grade" className="mb-1 block text-sm font-medium text-gray-700">
              Оценка
            </label>
            <input
              id="grade"
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {gradeMutation.errorMessage && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {gradeMutation.errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!grade || gradeMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {gradeMutation.isPending ? 'Сохранение...' : 'Поставить оценку'}
          </button>
        </form>
      )}
    </div>
  )
}
