import { useState } from 'react'
import { useTeamsQuery } from '@/features/teams/hooks/useTeamsQuery'
import { useTeamGradesQuery } from '@/features/team-grades/hooks/useTeamGradesQuery'
import { useTeamGradeAssessmentQuery } from './hooks/useAssessmentQueries'
import { AssessmentForm } from './AssessmentForm'
import { AssessmentView } from './AssessmentView'
import { IndividualAdjustmentPanel } from '@/features/team-grades/IndividualAdjustmentPanel'
import type { RubricDto, TeamGradeListItemDto, TeamListItemDto } from '@/types/dto'

interface Props {
  rubric: RubricDto
  assignmentId: string
  classId: string
}

export function TeamRubricWidget({ rubric, assignmentId, classId }: Props) {
  const { data: teamsPage, isLoading: teamsLoading } = useTeamsQuery(classId, undefined, 0, 100)
  const { data: gradesPage, isLoading: gradesLoading } = useTeamGradesQuery(assignmentId)

  if (teamsLoading || gradesLoading) {
    return <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
  }

  const teams = teamsPage?.content ?? []
  const grades = gradesPage?.content ?? []
  const gradeByTeam = new Map(grades.map((g) => [g.teamId, g]))

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Командные оценки по рубрике</h2>

      {teams.length === 0 ? (
        <p className="text-sm text-gray-500">Нет команд для оценивания.</p>
      ) : (
        <div className="space-y-2">
          {teams.map((team) => (
            <TeamRow
              key={team.id}
              team={team}
              rubric={rubric}
              assignmentId={assignmentId}
              existingGrade={gradeByTeam.get(team.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TeamRow({
  team,
  rubric,
  assignmentId,
  existingGrade,
}: {
  team: TeamListItemDto
  rubric: RubricDto
  assignmentId: string
  existingGrade?: TeamGradeListItemDto
}) {
  const [expanded, setExpanded] = useState(false)
  const [showAdjustments, setShowAdjustments] = useState(false)
  const teamGradeId = existingGrade?.id
  const { data: assessment } = useTeamGradeAssessmentQuery(teamGradeId, !!teamGradeId && expanded)

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium text-gray-900">{team.name}</p>
          <p className="text-xs text-gray-500">{team.memberCount} участн.</p>
        </div>
        <div className="flex items-center gap-3">
          {existingGrade ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {existingGrade.grade}
            </span>
          ) : (
            <span className="text-xs text-gray-400">не оценено</span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            {expanded ? 'Свернуть' : existingGrade ? 'Открыть' : 'Оценить'}
          </button>
          {existingGrade && (
            <button
              onClick={() => setShowAdjustments(!showAdjustments)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {showAdjustments ? 'Скрыть' : 'Корректировки'}
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4">
          {existingGrade && assessment ? (
            <AssessmentEditableSection
              rubric={rubric}
              assignmentId={assignmentId}
              teamId={team.id}
              teamGradeId={teamGradeId}
              assessment={assessment}
            />
          ) : (
            <AssessmentForm
              rubric={rubric}
              assignmentId={assignmentId}
              teamId={team.id}
              teamGradeId={teamGradeId}
              existing={null}
              onSaved={() => setExpanded(false)}
            />
          )}
        </div>
      )}

      {showAdjustments && existingGrade && (
        <IndividualAdjustmentPanel
          assignmentId={assignmentId}
          teamGradeId={existingGrade.id}
          teamGrade={existingGrade.grade}
          isOwnerOrTeacher={true}
        />
      )}
    </div>
  )
}

function AssessmentEditableSection({
  rubric,
  assignmentId,
  teamId,
  teamGradeId,
  assessment,
}: {
  rubric: RubricDto
  assignmentId: string
  teamId: string
  teamGradeId?: string
  assessment: NonNullable<ReturnType<typeof useTeamGradeAssessmentQuery>['data']>
}) {
  const [editing, setEditing] = useState(false)

  if (!editing && assessment) {
    return (
      <div className="space-y-3">
        <AssessmentView rubric={rubric} assessment={assessment} />
        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Изменить оценивание
          </button>
        </div>
      </div>
    )
  }

  return (
    <AssessmentForm
      rubric={rubric}
      assignmentId={assignmentId}
      teamId={teamId}
      teamGradeId={teamGradeId}
      existing={assessment}
      onSaved={() => setEditing(false)}
    />
  )
}
