import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()

  return <LoginForm onSuccess={() => navigate('/classes', { replace: true })} />
}
