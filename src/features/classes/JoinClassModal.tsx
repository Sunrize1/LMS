import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJoinClassMutation } from './hooks/useJoinClassMutation'

const schema = z.object({
  code: z.string().length(8, 'Код должен быть 8 символов'),
})

type FormValues = z.infer<typeof schema>

interface JoinClassModalProps {
  isOpen: boolean
  onClose: () => void
  initialCode?: string
}

export function JoinClassModal({ isOpen, onClose, initialCode }: JoinClassModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { code: initialCode || '' },
  })

  const { mutate, isPending, errorMessage } = useJoinClassMutation()

  useEffect(() => {
    if (initialCode) setValue('code', initialCode, { shouldValidate: true })
  }, [initialCode, setValue])

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
    mutate(data, {
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
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Присоединиться к классу</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="class-code" className="mb-1 block text-sm font-medium text-gray-700">
              Код класса
            </label>
            <input
              id="class-code"
              type="text"
              maxLength={8}
              {...register('code')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono tracking-wider focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="ABCD1234"
            />
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
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
              {isPending ? 'Подключение...' : 'Присоединиться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
