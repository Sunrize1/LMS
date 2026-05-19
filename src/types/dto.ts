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

export type AssignmentType = 'STANDARD' | 'QUICK'

export interface AssignmentDto {
  id: string
  title: string
  description: string | null
  deadline: string | null
  type?: AssignmentType
  isTeamBased?: boolean
  createdAt: string
  submissionStatus?: SubmissionStatus
  grade?: number | null
  fileUrls?: string[] | null
}

export interface AssignmentDetailDto {
  id: string
  classId: string
  title: string
  description: string | null
  deadline: string | null
  type?: AssignmentType
  isTeamBased?: boolean
  createdBy: string
  createdByName: string
  createdAt: string
  submissionStatus?: SubmissionStatus
  grade?: number | null
  fileUrls?: string[] | null
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

// ── Team ───────────────────────────────────────
export interface TeamDto {
  id: string
  classId: string
  assignmentId: string | null
  name: string
  members: TeamMemberDto[]
  createdBy: string
  createdAt: string
}

export interface TeamMemberDto {
  userId: string
  firstName: string
  lastName: string
  isLeader: boolean
  joinedAt?: string
}

export interface TeamListItemDto {
  id: string
  name: string
  assignmentId: string | null
  memberCount: number
  leaderName: string
  createdAt: string
}

export interface ShuffleResponse {
  teams: TeamDto[]
  totalStudents: number
  studentsPerTeam: number
}

// ── Team Grade ─────────────────────────────────
export interface TeamGradeDto {
  id: string
  teamId: string
  teamName: string
  assignmentId: string
  grade: number
  comment: string | null
  individualGrades: IndividualAdjustmentDto[]
  gradedBy: string
  gradedAt: string
}

export interface TeamGradeListItemDto {
  id: string
  teamId: string
  teamName: string
  grade: number
  memberCount: number
  gradedAt: string
}

export interface IndividualAdjustmentDto {
  studentId: string
  studentName: string
  teamGrade: number
  adjustment: number
  finalGrade: number
  comment: string | null
  gradedBy?: string
  gradedAt?: string
}

export interface MyTeamGradeDto {
  teamId: string
  teamName: string
  teamGrade: number
  myAdjustment: number
  myFinalGrade: number
  comment: string | null
  gradedAt: string
}

// ── Quick Assignment ───────────────────────────
export interface QuickAssignmentDto {
  id: string
  classId: string
  title: string
  type: 'QUICK'
  isTeamBased: boolean
  deadline: null
  teams: { id: string; name: string }[] | null
  createdBy: string
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

// ── Rubric ──────────────────────────────────────
export type CriterionKind = 'BOOLEAN' | 'PERCENT' | 'SCORE'
export type CriterionRole = 'PRIMARY' | 'BONUS'

export interface CriterionTemplateDto {
  id: string
  ordinal: number
  title: string
  description: string | null
  kind: CriterionKind
  role: CriterionRole
  maxPoints: string | null
  maxCoefficient: string | null
  scoreMin: string | null
  scoreMax: string | null
}

export interface RubricTemplateDto {
  id: string
  classId: string
  name: string
  description: string | null
  totalMaxPoints: string
  allowOvercap: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  criteria: CriterionTemplateDto[]
}

export interface RubricTemplateShortDto {
  id: string
  name: string
  totalMaxPoints: string
  criteriaCount: number
  createdAt: string
}

export interface CriterionDto {
  id: string
  ordinal: number
  title: string
  description: string | null
  kind: CriterionKind
  role: CriterionRole
  maxPoints: string | null
  maxCoefficient: string | null
  scoreMin: string | null
  scoreMax: string | null
}

export interface RubricDto {
  id: string
  assignmentId: string
  sourceTemplateId: string | null
  name: string
  description: string | null
  totalMaxPoints: string
  allowOvercap: boolean
  frozenAt: string
  criteria: CriterionDto[]
}

export interface CriterionScoreDto {
  id: string
  criterionId: string
  boolValue: boolean | null
  percentValue: string | null
  scoreValue: string | null
  computedPoints: string
  comment: string | null
}

export interface AssessmentDto {
  id: string
  rubricId: string
  assignmentId: string
  submissionId: string | null
  teamGradeId: string | null
  primarySum: string
  bonusMultiplier: string
  finalScore: string
  finalScoreNormalized: number
  gradedBy: string
  gradedAt: string
  scores: CriterionScoreDto[]
}

export interface MyAssessmentCriterionDto {
  title: string
  kind: CriterionKind
  role: CriterionRole
  value: string | boolean | null
  maxPoints: string | null
  maxCoefficient: string | null
  scoreMin: string | null
  scoreMax: string | null
  computedPoints: string
  comment: string | null
}

export interface MyAssessmentDto {
  assignmentId: string
  assignmentTitle: string
  assessmentId: string
  finalScore: string
  totalMaxPoints: string
  finalScoreNormalized: number
  criteria: MyAssessmentCriterionDto[]
}

export interface RubricExportPayload {
  $schema?: string
  version: string
  exportedAt?: string
  rubric: {
    name: string
    description: string | null
    totalMaxPoints: string
    allowOvercap: boolean
    criteria: Array<Omit<CriterionTemplateDto, 'id'>>
  }
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
