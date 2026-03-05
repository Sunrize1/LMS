import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { JoinClassModal } from '@/features/classes/JoinClassModal'

export default function JoinPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const code = searchParams.get('code') || ''

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <JoinClassModal
        isOpen={true}
        onClose={() => navigate('/classes')}
        initialCode={code}
      />
    </div>
  )
}
