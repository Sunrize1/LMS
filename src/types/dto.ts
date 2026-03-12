// ── User ────────────────────────────────────────
export interface UserDto {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string | null
  dateOfBirth: string | null
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: UserDto
}

// ── Class ───────────────────────────────────────
export type Role = 'OWNER' | 'TEACHER' | 'STUDENT'

export interface ClassDto {
  id: string
  name: string
  code: string
  myRole: Role
  memberCount: number
  createdAt: string
}

export interface MemberDto {
  userId: string
  firstName: string
  lastName: string
  email: string
  role: Role
  joinedAt: string
  avatarUrl: string | null
}

// ── Assignment ──────────────────────────────────
export type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED'

export interface AssignmentDto {
  id: string
  title: string
  description: string | null
  deadline: string | null
  createdAt: string
  submissionStatus?: SubmissionStatus
  grade?: number | null
}

export interface AssignmentDetailDto {
  id: string
  classId: string
  title: string
  description: string | null
  deadline: string | null
  createdBy: string
  createdByName: string
  createdAt: string
  submissionStatus?: SubmissionStatus
  grade?: number | null
}

// ── Submission ──────────────────────────────────
export interface SubmissionDto {
  id: string
  studentId: string
  studentName: string
  studentAvatarUrl: string | null
  answerText: string | null
  fileUrls: string[] | null
  grade: number | null
  submittedAt: string
}

// ── Comment ─────────────────────────────────────
export interface CommentDto {
  id: string
  assignmentId: string
  authorId: string
  authorName: string
  authorAvatarUrl: string | null
  text: string
  createdAt: string
}

// ── Pagination ─────────────────────────────────
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

// ── Error ───────────────────────────────────────
export interface ApiError {
  status: number
  message: string
  errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
}
