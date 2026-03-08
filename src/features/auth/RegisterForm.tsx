import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useRegisterMutation } from './hooks/useRegisterMutation'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Имя обязательно'),
    lastName: z.string().min(1, 'Фамилия обязательна'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
    dateOfBirth: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const { mutate, isPending, errorMessage } = useRegisterMutation()

  const onSubmit = (data: RegisterFormValues) => {
    mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth || undefined,
      },
      {
        onSuccess: () => onSuccess?.(),
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h1 className="text-center text-2xl font-bold text-gray-900">Регистрация</h1>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="user@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-700">
          Пароль
        </label>
        <input
          id="reg-password"
          type="password"
          {...register('password')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Минимум 8 символов"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {errorMessage && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Войти
        </Link>
      </p>
    </form>
  )
}
