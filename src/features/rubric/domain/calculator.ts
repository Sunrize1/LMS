import type { CriterionDto, CriterionScoreDto } from '@/types/dto'
import type { CriterionScoreInput } from '@/types/requests'
import { fromDecimal, toPoints, toCoefficient, type DecimalString } from './decimal'

export interface CalculationResult {
  primarySum: DecimalString
  bonusMultiplier: DecimalString
  finalScore: DecimalString
  finalScoreNormalized: number
  computedPoints: Map<string, DecimalString>
}

type ScoreLike =
  | Pick<CriterionScoreDto, 'criterionId' | 'boolValue' | 'percentValue' | 'scoreValue'>
  | CriterionScoreInput

interface RubricLike {
  totalMaxPoints: string
  allowOvercap: boolean
  criteria: CriterionDto[]
}

function ratio(criterion: CriterionDto, score: ScoreLike): number {
  if (criterion.kind === 'BOOLEAN') return score.boolValue ? 1 : 0
  if (criterion.kind === 'PERCENT') {
    const p = fromDecimal(score.percentValue ?? null)
    return Math.max(0, Math.min(1, p / 100))
  }
  // SCORE
  const min = fromDecimal(criterion.scoreMin)
  const max = fromDecimal(criterion.scoreMax)
  const v = fromDecimal(score.scoreValue ?? null)
  if (max === min) return 0
  return Math.max(0, Math.min(1, (v - min) / (max - min)))
}

export function calculate(rubric: RubricLike, scores: ScoreLike[]): CalculationResult {
  const totalMax = fromDecimal(rubric.totalMaxPoints)
  const byCriterion = new Map(scores.map((s) => [s.criterionId, s]))

  const computed = new Map<string, DecimalString>()
  let primarySum = 0
  let bonusDelta = 0

  for (const c of rubric.criteria) {
    const s = byCriterion.get(c.id)
    if (!s) continue
    const r = ratio(c, s)
    if (c.role === 'PRIMARY') {
      const max = fromDecimal(c.maxPoints)
      const pts = max * r
      primarySum += pts
      computed.set(c.id, toPoints(pts))
    } else {
      const maxCoef = fromDecimal(c.maxCoefficient)
      const delta = (maxCoef - 1) * r
      bonusDelta += delta
      computed.set(c.id, toCoefficient(delta))
    }
  }

  const primarySumCapped = Math.min(primarySum, totalMax)
  const bonusMultiplier = 1 + bonusDelta
  const finalRaw = primarySumCapped * bonusMultiplier
  const finalScore = rubric.allowOvercap ? finalRaw : Math.min(finalRaw, totalMax)
  const normalized =
    totalMax === 0 ? 0 : Math.round((finalScore / totalMax) * 100)
  const finalScoreNormalized = Math.max(0, Math.min(100, normalized))

  return {
    primarySum: toPoints(primarySum),
    bonusMultiplier: toCoefficient(bonusMultiplier),
    finalScore: toPoints(finalScore),
    finalScoreNormalized,
    computedPoints: computed,
  }
}
