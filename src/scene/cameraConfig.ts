// Simple vertical parallax — the single place to tune how the scene drifts as
// the page scrolls. p is scroll progress in [0, 1] (spring-scrubbed in hooks.ts).
// Every plane uses the same formula; only `depth` differs:
//     y = -depth * RANGE * p
// Far planes barely move, near planes drift most. No tilt, zoom or descent.

export const CAMERA = {
  /** Max upward travel at p=1 for a plane at depth 1 (viewBox px). */
  RANGE: 70,
  /** Headlight only switches on beyond this progress. */
  HEADLIGHT_THRESHOLD: 0.95,
  /** Headlight ramp end (the fire itself stays lit — see fireStrength). */
  IGNITE_END: 0.98,
  /** ~1s scrub (rough equivalent of ScrollTrigger scrub: 1), overdamped. */
  scrub: { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.001 },
} as const

/** Depth of every scene plane: 0 = sky, 1 = ground + camp. */
export const DEPTH = {
  sky: 0,
  ridgeFar: 0.1,
  ridgeMid: 0.3,
  ridgeNear: 0.4,
  treeFar: 0.5,
  treeMid: 0.7,
  treeNear: 0.85,
  mist: [0.12, 0.3, 0.42],
  ground: 1,
  camp: 1,
} as const

/** Mouse drift 5px (far) → 20px (near), applied on an outer wrapper. */
export function mousePx(depth: number): number {
  return 5 + depth * 15
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/** Smoothstep — slight ease at both ends, no overshoot. */
export function easeInOut(t: number): number {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/** The only scroll transform: slide a plane upward, scaled by its depth. */
export function layerY(depth: number, p: number): number {
  return -depth * CAMERA.RANGE * p
}

/** Haze remaining: 1 at p=0 (far/hazy) → 0 at p=1 (true colours). */
export function hazeAmount(p: number): number {
  return 1 - easeInOut(p)
}

/** The fire never goes out — scrolling up only dials down its flare and glow. */
export function fireStrength(p: number): number {
  return 0.42 + 0.58 * easeInOut(p)
}
