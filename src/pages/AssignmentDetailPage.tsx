import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAssignmentQuery } from '@/features/assignments/hooks/useAssignmentQuery'
import { useMySubmissionQuery } from '@/features/assignments/hooks/useMySubmissionQuery'
import { useSubmissionsQuery } from '@/features/assignments/hooks/useSubmissionsQuery'
import { useSubmitMutation } from '@/features/assignments/hooks/useSubmitMutation'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'

export default function AssignmentDetailPage() {
  const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>()
  const { data: classData } = useClassQuery(classId!)
  const { data: assignment, isLoading: assignmentLoading } = useAssignmentQuery(assignmentId!)
  const isTeacherOrOwner =
    classData?.myRole === 'OWNER' || classData?.myRole === 'TEACHER'

  const { data: submission, isLoading: submissionLoading } = useMySubmissionQuery(assignmentId!)
  const { data: submissions } = useSubmissionsQuery(assignmentId!)
  const submitMutation = useSubmitMutation(assignmentId!)
  const [answerText, setAnswerText] = useState('')

  if (assignmentLoading || submissionLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-20 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!assignment) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitMutation.mutate({ answerText })
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{assignment.title}</h1>
      {assignment.description && (
        <p className="mb-6 text-gray-600">{assignment.description}</p>
      )}

      {isTeacherOrOwner && submissions && (
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Работы студентов</h2>
          {submissions.length === 0 && (
            <p className="text-gray-500">Пока нет отправленных работ</p>
          )}
          <div className="space-y-2">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                to={`/submissions/${sub.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">{sub.studentName}</span>
                <span className="text-sm text-gray-500">
                  {sub.grade !== null ? `Оценка: ${sub.grade}` : 'Не оценено'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isTeacherOrOwner && submission && (
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Ваш ответ</h2>
          {submission.answerText && (
            <p className="text-gray-700">{submission.answerText}</p>
          )}
          {submission.grade !== null && (
            <p className="mt-2 font-medium text-green-600">Оценка: {submission.grade}</p>
          )}
        </div>
      )}

      {!isTeacherOrOwner && !submission && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="answer" className="mb-1 block text-sm font-medium text-gray-700">
              Ответ
            </label>
            <textarea
              id="answer"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Введите ваш ответ..."
            />
          </div>

          {submitMutation.errorMessage && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {submitMutation.errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!answerText.trim() || submitMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitMutation.isPending ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      )}
    </div>
  )
}
