import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/RegisterForm'

export default function RegisterPage() {
  const navigate = useNavigate()

  return <RegisterForm onSuccess={() => navigate('/classes', { replace: true })} />
}
