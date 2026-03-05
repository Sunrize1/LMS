import { useParams } from 'react-router-dom'
import { useMembersQuery } from '@/features/classes/hooks/useMembersQuery'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useRemoveMemberMutation } from '@/features/classes/hooks/useRemoveMemberMutation'
import { useAuthStore } from '@/store/authStore'
import { RoleBadge } from '@/components/RoleBadge'

export default function MembersPage() {
  const { classId } = useParams<{ classId: string }>()
  const { data: classData } = useClassQuery(classId!)
  const { data: members, isLoading } = useMembersQuery(classId!)
  const removeMember = useRemoveMemberMutation(classId!)
  const currentUser = useAuthStore((s) => s.user)

  const isOwner = classData?.myRole === 'OWNER'

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            data-testid="member-skeleton"
            className="flex h-16 animate-pulse items-center rounded-lg bg-gray-200"
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Участники</h1>

      <div className="space-y-2">
        {members?.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RoleBadge role={member.role} />
              {isOwner && member.userId !== currentUser?.id && (
                <button
                  onClick={() => removeMember.mutate(member.id)}
                  className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
