import { cn } from '@/utils/cn'
import type { SubmissionStatus } from '@/types/dto'

const statusStyles: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-yellow-100 text-yellow-800',
  GRADED: 'bg-green-100 text-green-800',
}

interface StatusBadgeProps {
  status: SubmissionStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
