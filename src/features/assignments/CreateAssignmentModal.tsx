import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAssignmentMutation } from './hooks/useCreateAssignmentMutation'

const schema = z.object({
  title: z.string().min(1, 'Название обязательно').max(255),
  description: z.string().optional(),
  deadline: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface CreateAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  classId: string
}

export function CreateAssignmentModal({ isOpen, onClose, classId }: CreateAssignmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const { mutate, isPending, errorMessage } = useCreateAssignmentMutation(classId)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  if (!isOpen) return null

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
    }
    mutate(payload, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Создать задание</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="assignment-title" className="mb-1 block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              id="assignment-title"
              type="text"
              {...register('title')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Домашнее задание 1"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="assignment-description" className="mb-1 block text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              id="assignment-description"
              {...register('description')}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Описание задания (необязательно)"
            />
          </div>

          <div>
            <label htmlFor="assignment-deadline" className="mb-1 block text-sm font-medium text-gray-700">
              Дедлайн
            </label>
            <input
              id="assignment-deadline"
              type="datetime-local"
              {...register('deadline')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {errorMessage && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
