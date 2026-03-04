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
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  avatarUrl: string | null
  role: Role
  joinedAt: string
}

// ── Assignment ──────────────────────────────────
export type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED'

export interface AssignmentDto {
  id: string
  title: string
  description: string | null
  createdBy: string
  createdAt: string
  submissionStatus?: SubmissionStatus
}

export interface AssignmentDetailDto {
  id: string
  title: string
  description: string | null
  createdBy: string
  createdAt: string
}

// ── Submission ──────────────────────────────────
export interface SubmissionDto {
  id: string
  studentId: string
  studentName: string
  answerText: string | null
  fileUrl: string | null
  grade: number | null
  submittedAt: string
  gradedAt: string | null
}

// ── Comment ─────────────────────────────────────
export interface CommentDto {
  id: string
  authorId: string
  authorName: string
  authorAvatarUrl: string | null
  text: string
  createdAt: string
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
