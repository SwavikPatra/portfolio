import { LANDSCAPE, mulberry32, overscanBounds } from './landscapeConfig'

// The camp draws its ground line at local y=148 (see Camp.tsx). Mapped through
// the camp transform: 630 + 1.1·148 = 792.8, or 660 + 0.72·148 = 766.6 compact.
export const GROUND_Y = 792.8
export const COMPACT_GROUND_Y = 766.6

// Edge safety: the plane is wider than the viewport and extends well past the
// bottom so the vertical parallax drift never reveals an edge.
const BOUNDS = overscanBounds(LANDSCAPE)
export const X0 = BOUNDS.x0
export const X1 = BOUNDS.x1
export const BOTTOM = 1500

export function groundPath(top: number): string {
  const rand = mulberry32(9137)
  const parts = [`M${X0} ${top.toFixed(1)}`]
  for (let x = X0 + 48; x < X1; x += 96) {
    parts.push(`L${x} ${(top + (rand() - 0.5) * 7).toFixed(1)}`)
  }
  parts.push(`L${X1} ${top.toFixed(1)}`, `L${X1} ${BOTTOM}`, `L${X0} ${BOTTOM}`, 'Z')
  return parts.join(' ')
}

const GROUND_DESKTOP = groundPath(GROUND_Y)
const GROUND_COMPACT = groundPath(COMPACT_GROUND_Y)

/** The exact opaque ground silhouette, reused to clip the night firelight. */
export function foregroundGroundPath(compact: boolean): string {
  return compact ? GROUND_COMPACT : GROUND_DESKTOP
}
