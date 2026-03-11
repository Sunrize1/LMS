import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAssignmentQuery } from '@/features/assignments/hooks/useAssignmentQuery'
import { useMySubmissionQuery } from '@/features/assignments/hooks/useMySubmissionQuery'
import { useSubmissionsQuery } from '@/features/assignments/hooks/useSubmissionsQuery'
import { useSubmitMutation } from '@/features/assignments/hooks/useSubmitMutation'
import { useCancelSubmissionMutation } from '@/features/assignments/hooks/useCancelSubmissionMutation'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { CommentsSection } from '@/features/comments/CommentsSection'

type GradeFilter = 'all' | 'graded' | 'not_graded'

function formatDeadline(deadline: string): string {
  const d = new Date(deadline)
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AssignmentDetailPage() {
  const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>()
  const { data: classData, isLoading: classLoading } = useClassQuery(classId!)
  const { data: assignment, isLoading: assignmentLoading } = useAssignmentQuery(assignmentId!)

  const isTeacherOrOwner =
    classData?.myRole === 'OWNER' || classData?.myRole === 'TEACHER'

  const [page, setPage] = useState(0)
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all')

  const submissionsParams = {
    page,
    size: 10,
    ...(gradeFilter === 'graded' && { graded: true }),
    ...(gradeFilter === 'not_graded' && { graded: false }),
  }

  const { data: submissionsPage, isLoading: submissionsLoading } = useSubmissionsQuery(
    assignmentId!,
    !classLoading && isTeacherOrOwner,
    submissionsParams,
  )
  const { data: submission, isLoading: submissionLoading } = useMySubmissionQuery(
    assignmentId!,
    !classLoading && !isTeacherOrOwner,
  )

  const submitMutation = useSubmitMutation(assignmentId!)
  const cancelMutation = useCancelSubmissionMutation(assignmentId!)
  const [answerText, setAnswerText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  if (classLoading || assignmentLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-20 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!assignment) return null

  const deadlinePassed = assignment.deadline
    ? new Date(assignment.deadline) < new Date()
    : false

  const canCancel = submission && submission.grade === null && !deadlinePassed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitMutation.mutate({ answerText, file: file ?? undefined })
  }

  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить отправку?')) {
      cancelMutation.mutate()
    }
  }

  const handleFilterChange = (filter: GradeFilter) => {
    setGradeFilter(filter)
    setPage(0)
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">{assignment.title}</h1>
      {assignment.description && (
        <p className="mb-2 text-gray-600">{assignment.description}</p>
      )}

      {assignment.deadline && (
        <p className={`mb-6 text-sm ${deadlinePassed ? 'font-medium text-red-600' : 'text-gray-500'}`}>
          Дедлайн: {formatDeadline(assignment.deadline)}
          {deadlinePassed && ' (просрочено)'}
        </p>
      )}

      {!assignment.deadline && <div className="mb-4" />}

      {isTeacherOrOwner && (
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Работы студентов</h2>
            <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
              {([
                ['all', 'Все'],
                ['graded', 'Оценённые'],
                ['not_graded', 'Не оценённые'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value)}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                    gradeFilter === value
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {submissionsLoading ? (
            <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
          ) : submissionsPage && submissionsPage.content.length > 0 ? (
            <>
              <div className="space-y-2">
                {submissionsPage.content.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/submissions/${sub.id}`}
                    state={sub}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md"
                  >
                    <span className="font-medium text-gray-900">{sub.studentName}</span>
                    <span className="text-sm text-gray-500">
                      {sub.grade !== null ? `Оценка: ${sub.grade}` : 'Не оценено'}
                    </span>
                  </Link>
                ))}
              </div>

              {submissionsPage.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={submissionsPage.first}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                  >
                    Назад
                  </button>
                  <span className="text-sm text-gray-500">
                    {submissionsPage.number + 1} / {submissionsPage.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={submissionsPage.last}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                  >
                    Вперёд
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Пока нет отправленных работ</p>
          )}
        </div>
      )}

      {!isTeacherOrOwner && submissionLoading && (
        <div className="mb-6 h-24 animate-pulse rounded-lg bg-gray-200" />
      )}

      {!isTeacherOrOwner && !submissionLoading && submission && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Ваш ответ</h2>
          {submission.answerText && (
            <p className="text-gray-700">{submission.answerText}</p>
          )}
          {submission.fileUrl && (
            <a
              href={submission.fileUrl}
              className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Скачать файл
            </a>
          )}
          {submission.grade !== null && (
            <p className="mt-2 font-medium text-green-600">Оценка: {submission.grade}</p>
          )}

          {canCancel && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Отмена...' : 'Отменить отправку'}
              </button>
              {cancelMutation.errorMessage && (
                <p className="mt-2 text-sm text-red-600">{cancelMutation.errorMessage}</p>
              )}
            </div>
          )}
        </div>
      )}

      {!isTeacherOrOwner && !submissionLoading && !submission && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {deadlinePassed ? (
            <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-600">
              Дедлайн прошёл. Сдача ответа невозможна.
            </p>
          ) : (
            <>
              <div>
                <label htmlFor="answer" className="mb-1 block text-sm font-medium text-gray-700">
                  Ответ
                </label>
                <textarea
                  id="answer"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Введите ваш ответ..."
                />
              </div>

              <div>
                <label htmlFor="file" className="mb-1 block text-sm font-medium text-gray-700">
                  Прикрепить файл
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-600 hover:file:bg-indigo-100"
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
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitMutation.isPending ? 'Отправка...' : 'Отправить'}
              </button>
            </>
          )}
        </form>
      )}

      <CommentsSection assignmentId={assignmentId!} />
    </div>
  )
}
