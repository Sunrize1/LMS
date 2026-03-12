import { cn } from '@/utils/cn'
import type { Role } from '@/types/dto'
import { translateRole } from '@/utils/roleTranslations'

const roleStyles: Record<Role, string> = {
  OWNER: 'bg-purple-100 text-purple-800',
  TEACHER: 'bg-blue-100 text-blue-800',
  STUDENT: 'bg-green-100 text-green-800',
}

interface RoleBadgeProps {
  role: Role
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        roleStyles[role],
        className,
      )}
    >
      {translateRole(role)}
    </span>
  )
}
