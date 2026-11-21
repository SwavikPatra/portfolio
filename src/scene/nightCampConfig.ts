// Night campsite placement, shared by the rider, the fire and its light so
// moving the person moves the fire (and the glow) with them.

/** Shared seat + firepit spot in camp-local coords (ground line y=148). */
export const NIGHT_SPOT = { x: 265, y: 0 } as const

/** Camp group transform, reused by Camp.tsx and the fire → viewBox math. */
export const CAMP_PLACEMENT = {
  desktop: { tx: 890, ty: 630, scale: 1.1 },
  compact: { tx: 560, ty: 660, scale: 0.72 },
} as const

/** Firepit centre in the foreground group's viewBox space. */
export function fireToForeground(compact: boolean): { x: number; y: number } {
  const p = compact ? CAMP_PLACEMENT.compact : CAMP_PLACEMENT.desktop
  return {
    x: p.tx + p.scale * NIGHT_SPOT.x,
    y: p.ty + p.scale * 148,
  }
}
