interface CreateAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  classId: string
}

export function CreateAssignmentModal({ isOpen }: CreateAssignmentModalProps) {
  if (!isOpen) return null
  return <div>CreateAssignmentModal placeholder</div>
}
