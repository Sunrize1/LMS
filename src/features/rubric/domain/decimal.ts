/**
 * Decimal helpers — backend posts numbers as strings (BigDecimal-safe).
 * We do internal math in JS number, but always serialize back as a
 * fixed-scale string so we never accidentally send `1.1500000000001`.
 */

export type DecimalString = string

export function fromDecimal(value: string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function toDecimal(value: number, scale: number): DecimalString {
  if (!Number.isFinite(value)) return (0).toFixed(scale)
  const factor = Math.pow(10, scale)
  const rounded = Math.sign(value) * Math.round(Math.abs(value) * factor) / factor
  return rounded.toFixed(scale)
}

export const toPoints = (n: number): DecimalString => toDecimal(n, 2)
export const toCoefficient = (n: number): DecimalString => toDecimal(n, 4)
