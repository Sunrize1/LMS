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
  avatarUrl?: string
  dateOfBirth?: string
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
  deadline?: string
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

// ── Team ────────────────────────────────────────
export interface CreateTeamRequest {
  name: string
  assignmentId?: string | null
  memberUserIds: string[]
  leaderUserId?: string
}

export interface UpdateTeamRequest {
  name?: string
  leaderUserId?: string
}

export interface AddTeamMemberRequest {
  userId: string
  isLeader: boolean
}

export interface ShuffleRequest {
  teamCount: number
  assignmentId?: string | null
  strategy: 'RANDOM' | 'BALANCED'
}

// ── Team Grade ──────────────────────────────────
export interface CreateTeamGradeRequest {
  teamId: string
  grade: number
  comment?: string
}

export interface UpdateTeamGradeRequest {
  grade: number
  comment?: string
}

export interface UpdateAdjustmentRequest {
  adjustment: number
  comment?: string
}

// ── Rubric ──────────────────────────────────────
export interface CriterionTemplateInput {
  ordinal: number
  title: string
  description?: string | null
  kind: 'BOOLEAN' | 'PERCENT' | 'SCORE'
  role: 'PRIMARY' | 'BONUS'
  maxPoints?: string | null
  maxCoefficient?: string | null
  scoreMin?: string | null
  scoreMax?: string | null
}

export interface CreateRubricTemplateRequest {
  name: string
  description?: string | null
  totalMaxPoints: string
  allowOvercap: boolean
  criteria: CriterionTemplateInput[]
}

export type UpdateRubricTemplateRequest = CreateRubricTemplateRequest

export interface AttachRubricRequest {
  fromTemplateId?: string
  adhoc?: CreateRubricTemplateRequest
}

export interface CriterionScoreInput {
  criterionId: string
  boolValue?: boolean | null
  percentValue?: string | null
  scoreValue?: string | null
  comment?: string | null
}

export interface CreateAssessmentRequest {
  submissionId?: string | null
  teamGradeId?: string | null
  scores: CriterionScoreInput[]
}

export interface UpdateAssessmentRequest {
  scores: CriterionScoreInput[]
}

// ── Quick Assignment ────────────────────────────
export interface CreateQuickAssignmentRequest {
  title: string
  isTeamBased: boolean
  teamIds?: string[]
}
