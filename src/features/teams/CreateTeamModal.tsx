import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTeamMutation } from './hooks/useCreateTeamMutation'
import { useMembersQuery } from '@/features/classes/hooks/useMembersQuery'

const schema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100),
})

type FormValues = z.infer<typeof schema>

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
  classId: string
}

export function CreateTeamModal({ isOpen, onClose, classId }: CreateTeamModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const { mutate, isPending, errorMessage } = useCreateTeamMutation(classId)
  const { data: members } = useMembersQuery(classId)
  const students = members?.filter((m) => m.role === 'STUDENT') ?? []

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [leaderId, setLeaderId] = useState<string | null>(null)
  const [isPermanent, setIsPermanent] = useState(true)

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
    if (!isOpen) {
      reset()
      setSelectedIds([])
      setLeaderId(null)
      setIsPermanent(true)
    }
  }, [isOpen, reset])

  if (!isOpen) return null

  const toggleMember = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    )
    if (leaderId === userId) setLeaderId(null)
  }

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        name: data.name,
        assignmentId: isPermanent ? null : undefined,
        memberUserIds: selectedIds,
        leaderUserId: leaderId ?? undefined,
      },
      { onSuccess: () => onClose() },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Создать команду</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="team-name" className="mb-1 block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              id="team-name"
              type="text"
              {...register('name')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ансамбль A"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="permanent"
              type="checkbox"
              checked={isPermanent}
              onChange={(e) => setIsPermanent(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="permanent" className="text-sm text-gray-700">
              Постоянная команда (на весь курс)
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Участники ({selectedIds.length} выбрано)
            </label>
            <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200">
              {students.length === 0 ? (
                <p className="p-3 text-sm text-gray-500">Нет учеников в классе</p>
              ) : (
                students.map((student) => {
                  const isSelected = selectedIds.includes(student.userId)
                  return (
                    <div
                      key={student.userId}
                      className={`flex cursor-pointer items-center justify-between border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-50 ${isSelected ? 'bg-indigo-50' : ''}`}
                      onClick={() => toggleMember(student.userId)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm text-gray-900">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setLeaderId(leaderId === student.userId ? null : student.userId)
                          }}
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            leaderId === student.userId
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {leaderId === student.userId ? 'Лидер' : 'Назначить лидером'}
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
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
              disabled={!isValid || selectedIds.length === 0 || isPending}
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
