import { useState } from 'react'
import { useCommentsQuery } from './hooks/useCommentsQuery'
import { useAddCommentMutation } from './hooks/useAddCommentMutation'

interface CommentsSectionProps {
  assignmentId: string
}

export function CommentsSection({ assignmentId }: CommentsSectionProps) {
  const { data: comments, isLoading } = useCommentsQuery(assignmentId)
  const addComment = useAddCommentMutation(assignmentId)
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addComment.mutate(
      { text: text.trim() },
      { onSuccess: () => setText('') },
    )
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Комментарии</h2>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      )}

      {comments && (
        <div className="mb-4 space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                {comment.authorAvatarUrl ? (
                  <img
                    src={comment.authorAvatarUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                    {comment.authorName.split(' ').map(p => p[0]).join('').slice(0, 2)}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900">
                  {comment.authorName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="ml-9 text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать комментарий..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!text.trim() || addComment.isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
        >
          Отправить
        </button>
      </form>
    </div>
  )
}
