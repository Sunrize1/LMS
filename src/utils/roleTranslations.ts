import type { Role } from '@/types/dto'

export const roleTranslations: Record<Role, string> = {
  OWNER: 'Владелец',
  TEACHER: 'Преподаватель',
  STUDENT: 'Студент',
}

export function translateRole(role: Role): string {
  return roleTranslations[role]
}
