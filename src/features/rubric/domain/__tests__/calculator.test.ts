import { describe, it, expect } from 'vitest'
import { calculate } from '../calculator'
import type { CriterionDto } from '@/types/dto'

const primaryBool = (id: string, max: string): CriterionDto => ({
  id,
  ordinal: 0,
  title: 't',
  description: null,
  kind: 'BOOLEAN',
  role: 'PRIMARY',
  maxPoints: max,
  maxCoefficient: null,
  scoreMin: null,
  scoreMax: null,
})

const primaryPercent = (id: string, max: string): CriterionDto => ({
  ...primaryBool(id, max),
  kind: 'PERCENT',
})

const primaryScore = (
  id: string,
  max: string,
  min: string,
  scoreMax: string,
): CriterionDto => ({
  ...primaryBool(id, max),
  kind: 'SCORE',
  scoreMin: min,
  scoreMax: scoreMax,
})

const bonusBool = (id: string, coef: string): CriterionDto => ({
  id,
  ordinal: 0,
  title: 't',
  description: null,
  kind: 'BOOLEAN',
  role: 'BONUS',
  maxPoints: null,
  maxCoefficient: coef,
  scoreMin: null,
  scoreMax: null,
})

describe('rubric calculator', () => {
  it('PRIMARY BOOLEAN true → full points', () => {
    const c = primaryBool('a', '2.00')
    const r = calculate(
      { totalMaxPoints: '2.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', boolValue: true }],
    )
    expect(r.primarySum).toBe('2.00')
    expect(r.finalScore).toBe('2.00')
    expect(r.finalScoreNormalized).toBe(100)
  })

  it('PRIMARY BOOLEAN false → zero', () => {
    const c = primaryBool('a', '2.00')
    const r = calculate(
      { totalMaxPoints: '2.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', boolValue: false }],
    )
    expect(r.primarySum).toBe('0.00')
    expect(r.finalScoreNormalized).toBe(0)
  })

  it('PRIMARY PERCENT 80% of 3.00 → 2.40', () => {
    const c = primaryPercent('a', '3.00')
    const r = calculate(
      { totalMaxPoints: '3.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', percentValue: '80.00' }],
    )
    expect(r.primarySum).toBe('2.40')
  })

  it('PRIMARY PERCENT 0 / 100 edges', () => {
    const c = primaryPercent('a', '5.00')
    const r0 = calculate(
      { totalMaxPoints: '5.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', percentValue: '0.00' }],
    )
    expect(r0.primarySum).toBe('0.00')
    const r100 = calculate(
      { totalMaxPoints: '5.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', percentValue: '100.00' }],
    )
    expect(r100.primarySum).toBe('5.00')
  })

  it('PRIMARY SCORE at max → full points', () => {
    const c = primaryScore('a', '5.00', '0.00', '5.00')
    const r = calculate(
      { totalMaxPoints: '5.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', scoreValue: '5.00' }],
    )
    expect(r.primarySum).toBe('5.00')
  })

  it('PRIMARY SCORE at min → zero', () => {
    const c = primaryScore('a', '5.00', '0.00', '5.00')
    const r = calculate(
      { totalMaxPoints: '5.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', scoreValue: '0.00' }],
    )
    expect(r.primarySum).toBe('0.00')
  })

  it('PRIMARY SCORE 4.5 / 5 of 5.00 → 4.50', () => {
    const c = primaryScore('a', '5.00', '0.00', '5.00')
    const r = calculate(
      { totalMaxPoints: '5.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', scoreValue: '4.50' }],
    )
    expect(r.primarySum).toBe('4.50')
  })

  it('BONUS BOOLEAN false → mult 1.0000', () => {
    const c = bonusBool('b', '1.1500')
    const r = calculate(
      {
        totalMaxPoints: '10.00',
        allowOvercap: false,
        criteria: [primaryBool('a', '10.00'), c],
      },
      [
        { criterionId: 'a', boolValue: true },
        { criterionId: 'b', boolValue: false },
      ],
    )
    expect(r.bonusMultiplier).toBe('1.0000')
    expect(r.finalScore).toBe('10.00')
  })

  it('BONUS BOOLEAN true → mult applies, clamp without overcap', () => {
    const c = bonusBool('b', '1.1500')
    const r = calculate(
      {
        totalMaxPoints: '10.00',
        allowOvercap: false,
        criteria: [primaryBool('a', '10.00'), c],
      },
      [
        { criterionId: 'a', boolValue: true },
        { criterionId: 'b', boolValue: true },
      ],
    )
    expect(r.bonusMultiplier).toBe('1.1500')
    // 10 * 1.15 = 11.5 → clamp to 10.00
    expect(r.finalScore).toBe('10.00')
    expect(r.finalScoreNormalized).toBe(100)
  })

  it('BONUS with overcap → no clamp', () => {
    const c = bonusBool('b', '1.1500')
    const r = calculate(
      {
        totalMaxPoints: '10.00',
        allowOvercap: true,
        criteria: [primaryBool('a', '10.00'), c],
      },
      [
        { criterionId: 'a', boolValue: true },
        { criterionId: 'b', boolValue: true },
      ],
    )
    expect(r.finalScore).toBe('11.50')
  })

  it('full PRD example: 8.90 × 1.15 → clamp 10.00', () => {
    const c1 = primaryBool('c1', '2.00')
    const c2 = primaryPercent('c2', '3.00')
    const c3 = primaryScore('c3', '5.00', '0.00', '5.00')
    const c4 = bonusBool('c4', '1.1500')
    const r = calculate(
      {
        totalMaxPoints: '10.00',
        allowOvercap: false,
        criteria: [c1, c2, c3, c4],
      },
      [
        { criterionId: 'c1', boolValue: true },
        { criterionId: 'c2', percentValue: '80.00' },
        { criterionId: 'c3', scoreValue: '4.50' },
        { criterionId: 'c4', boolValue: true },
      ],
    )
    expect(r.primarySum).toBe('8.90')
    expect(r.bonusMultiplier).toBe('1.1500')
    expect(r.finalScore).toBe('10.00')
    expect(r.finalScoreNormalized).toBe(100)
  })

  it('partial scoring → normalized < 100', () => {
    const c1 = primaryBool('c1', '5.00')
    const c2 = primaryBool('c2', '5.00')
    const r = calculate(
      { totalMaxPoints: '10.00', allowOvercap: false, criteria: [c1, c2] },
      [
        { criterionId: 'c1', boolValue: true },
        { criterionId: 'c2', boolValue: false },
      ],
    )
    expect(r.primarySum).toBe('5.00')
    expect(r.finalScoreNormalized).toBe(50)
  })

  it('missing score → criterion contributes zero', () => {
    const c = primaryBool('a', '2.00')
    const r = calculate(
      { totalMaxPoints: '2.00', allowOvercap: false, criteria: [c] },
      [],
    )
    expect(r.primarySum).toBe('0.00')
  })

  it('rounding HALF_UP-ish: 1.005 * 100 → 0.5 percent scale', () => {
    const c = primaryPercent('a', '1.00')
    // 33.33% of 1.00 = 0.3333 → toPoints rounds to 0.33
    const r = calculate(
      { totalMaxPoints: '1.00', allowOvercap: false, criteria: [c] },
      [{ criterionId: 'a', percentValue: '33.33' }],
    )
    expect(r.primarySum).toBe('0.33')
  })

  it('primary sum overshoot → cap before bonus multiplies', () => {
    const c1 = primaryBool('c1', '15.00')
    const c2 = bonusBool('c2', '1.1000')
    const r = calculate(
      {
        totalMaxPoints: '10.00',
        allowOvercap: false,
        criteria: [c1, c2],
      },
      [
        { criterionId: 'c1', boolValue: true },
        { criterionId: 'c2', boolValue: true },
      ],
    )
    // primary 15 → capped to 10 → * 1.1 = 11 → clamp 10
    expect(r.finalScore).toBe('10.00')
  })

  it('totalMaxPoints 0 → normalized 0 (defensive)', () => {
    const r = calculate(
      { totalMaxPoints: '0.00', allowOvercap: false, criteria: [] },
      [],
    )
    expect(r.finalScoreNormalized).toBe(0)
  })

  it('PERCENT 50 with bonus PERCENT 50 of 1.20 → partial contribution', () => {
    const c1 = primaryPercent('c1', '10.00')
    const c2: CriterionDto = {
      id: 'c2',
      ordinal: 1,
      title: 't',
      description: null,
      kind: 'PERCENT',
      role: 'BONUS',
      maxPoints: null,
      maxCoefficient: '1.2000',
      scoreMin: null,
      scoreMax: null,
    }
    const r = calculate(
      {
        totalMaxPoints: '10.00',
        allowOvercap: true,
        criteria: [c1, c2],
      },
      [
        { criterionId: 'c1', percentValue: '50.00' },
        { criterionId: 'c2', percentValue: '50.00' },
      ],
    )
    // primary = 5, mult = 1 + (0.2 * 0.5) = 1.10 → 5.5
    expect(r.primarySum).toBe('5.00')
    expect(r.bonusMultiplier).toBe('1.1000')
    expect(r.finalScore).toBe('5.50')
  })

  it('computedPoints map exposes per-criterion contribution', () => {
    const c1 = primaryBool('c1', '2.00')
    const c2 = bonusBool('c2', '1.1500')
    const r = calculate(
      { totalMaxPoints: '2.00', allowOvercap: false, criteria: [c1, c2] },
      [
        { criterionId: 'c1', boolValue: true },
        { criterionId: 'c2', boolValue: true },
      ],
    )
    expect(r.computedPoints.get('c1')).toBe('2.00')
    expect(r.computedPoints.get('c2')).toBe('0.1500')
  })
})
