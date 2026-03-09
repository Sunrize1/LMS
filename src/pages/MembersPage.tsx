import { useParams } from 'react-router-dom'
import { useMembersQuery } from '@/features/classes/hooks/useMembersQuery'
import { useClassQuery } from '@/features/classes/hooks/useClassQuery'
import { useRemoveMemberMutation } from '@/features/classes/hooks/useRemoveMemberMutation'
import { useAssignRoleMutation } from '@/features/classes/hooks/useAssignRoleMutation'
import { useAuthStore } from '@/store/authStore'
import { RoleBadge } from '@/components/RoleBadge'

export default function MembersPage() {
  const { classId } = useParams<{ classId: string }>()
  const { data: classData } = useClassQuery(classId!)
  const { data: members, isLoading } = useMembersQuery(classId!)
  const removeMember = useRemoveMemberMutation(classId!)
  const assignRole = useAssignRoleMutation(classId!)
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

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {members?.map((member, idx) => (
          <div
            key={member.userId}
            className={`flex items-center justify-between p-4 ${
              idx < (members.length - 1) ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
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
              {isOwner && member.userId !== currentUser?.id && member.role !== 'OWNER' ? (
                <select
                  value={member.role}
                  onChange={(e) =>
                    assignRole.mutate({
                      memberId: member.userId,
                      role: e.target.value as 'TEACHER' | 'STUDENT',
                    })
                  }
                  className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  aria-label={`Роль ${member.firstName} ${member.lastName}`}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="TEACHER">TEACHER</option>
                </select>
              ) : (
                <RoleBadge role={member.role} />
              )}
              {isOwner && member.userId !== currentUser?.id && (
                <button
                  onClick={() => removeMember.mutate(member.userId)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
