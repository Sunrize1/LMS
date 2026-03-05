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
            <div key={comment.id} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {comment.authorName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.text}</p>
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
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim() || addComment.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Отправить
        </button>
      </form>
    </div>
  )
}
