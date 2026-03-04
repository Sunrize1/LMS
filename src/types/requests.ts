// ── Auth ────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth?: string
  avatarBase64?: string
}

// ── User ────────────────────────────────────────
export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  dateOfBirth?: string
  avatarBase64?: string
}

// ── Class ───────────────────────────────────────
export interface CreateClassRequest {
  name: string
}

export interface JoinClassRequest {
  code: string
}

export interface UpdateClassRequest {
  name: string
}

// ── Assignment ──────────────────────────────────
export interface CreateAssignmentRequest {
  title: string
  description?: string
}

// ── Submission ──────────────────────────────────
export interface GradeRequest {
  grade: number
}

// ── Member ──────────────────────────────────────
export interface AssignRoleRequest {
  role: 'TEACHER' | 'STUDENT'
}

// ── Comment ─────────────────────────────────────
export interface AddCommentRequest {
  text: string
}
