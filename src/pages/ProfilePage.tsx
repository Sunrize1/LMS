import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfileQuery } from '@/features/users/hooks/useProfileQuery'
import { useUpdateProfileMutation } from '@/features/users/hooks/useUpdateProfileMutation'

const schema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  avatarUrl: z.string().url('Некорректный URL').or(z.literal('')).optional(),
  dateOfBirth: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfileQuery()
  const { mutate, isPending, errorMessage } = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      avatarUrl: '',
      dateOfBirth: '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl || '',
        dateOfBirth: profile.dateOfBirth || '',
      })
    }
  }, [profile, reset])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!profile) return null

  const onSubmit = (data: FormValues) => {
    mutate({
      ...data,
      avatarUrl: data.avatarUrl || undefined,
    })
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Профиль</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          {watch('avatarUrl') ? (
            <img
              src={watch('avatarUrl')}
              alt="Аватар"
              className="h-16 w-16 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }}
            />
          ) : null}
          <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600 ${watch('avatarUrl') ? 'hidden' : ''}`}>
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
              Имя
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
              Фамилия
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="avatarUrl" className="mb-1 block text-sm font-medium text-gray-700">
              URL аватара
            </label>
            <input
              id="avatarUrl"
              type="url"
              {...register('avatarUrl')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatarUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.avatarUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium text-gray-700">
              Дата рождения
            </label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {errorMessage && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}
