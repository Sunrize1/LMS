import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfileQuery } from '@/features/users/hooks/useProfileQuery'
import { useUpdateProfileMutation } from '@/features/users/hooks/useUpdateProfileMutation'

const schema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth || '',
      })
    }
  }, [profile, reset])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
        <div className="h-10 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!profile) return null

  const onSubmit = (data: FormValues) => {
    mutate(data)
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Профиль</h1>

      <p className="mb-4 text-gray-500">{profile.email}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {errorMessage && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  )
}
