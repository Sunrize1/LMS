import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProfileQuery } from '@/features/users/hooks/useProfileQuery'
import { useUpdateProfileMutation } from '@/features/users/hooks/useUpdateProfileMutation'
import { useUploadAvatarMutation } from '@/features/users/hooks/useUploadAvatarMutation'

const schema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  dateOfBirth: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfileQuery()
  const { mutate, isPending, errorMessage } = useUpdateProfileMutation()
  const uploadAvatar = useUploadAvatarMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

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
      setAvatarPreview(profile.avatarUrl || null)
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    uploadAvatar.mutate(file)
  }

  const onSubmit = (data: FormValues) => {
    mutate(data)
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Профиль</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-indigo-100 transition hover:opacity-80"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Аватар"
                className="h-full w-full object-cover"
                onError={() => setAvatarPreview(null)}
              />
            ) : (
              <span className="text-xl font-bold text-indigo-600">
                {profile.firstName[0]}{profile.lastName[0]}
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            data-testid="avatar-upload"
          />
          <div>
            <p className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
            {uploadAvatar.isPending && (
              <p className="text-xs text-indigo-600">Загрузка аватара...</p>
            )}
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
