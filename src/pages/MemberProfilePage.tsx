import { useParams } from 'react-router-dom'
import { useMemberQuery } from '@/features/classes/hooks/useMemberQuery'
import { RoleBadge } from '@/components/RoleBadge'

export default function MemberProfilePage() {
  const { classId, memberId } = useParams<{ classId: string; memberId: string }>()
  const { data: member, isLoading } = useMemberQuery(classId!, memberId!)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!member) return null

  return (
    <div>
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-medium text-gray-600">
          {member.firstName[0]}
          {member.lastName[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {member.firstName} {member.lastName}
          </h1>
          <p className="text-gray-500">{member.email}</p>
          <div className="mt-2">
            <RoleBadge role={member.role} />
          </div>
        </div>
      </div>
    </div>
  )
}
