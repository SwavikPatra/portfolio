// Layered landscape: single source of truth for geometry (ridge shape, tree
// scatter, spacing, seed). Motion tuning — K, L, start scale and every layer's
// depth — lives in cameraConfig.ts. Colours live in sceneTheme.ts.

/** Deterministic PRNG — same seed → identical ridges and tree scatter. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface MountainLayerConfig {
  /** Mean ridge Y in viewBox units (900 = bottom). */
  ridgeY: number
  /** Peak-to-mean vertical swing. */
  amplitude: number
  /** Samples across the overscanned span. */
  segments: number
  /** 0 = rolling sine, 1 = jagged peaks. */
  roughness: number
}

export interface TreeLayerConfig {
  count: number
  mobileCount: number
  scaleMin: number
  scaleMax: number
  /** Ground line Y at layer centre — trees root here, fill sits below. */
  groundY: number
  /**
   * Left→right tilt in viewBox px (y grows downward).
   * + = left higher (left valley wall), − = right higher (right wall).
   */
  tilt: number
  /** Undulation amplitude (viewBox px) layered on top of the straight tilt. */
  wobble: number
  /** One silhouette per layer — no mixing across depths. */
  symbolId: string
  /** Near layer: let the fill run past the viewBox bottom. */
  cropBottom?: boolean
  /** Spread a small count evenly across the visible viewport, not the overscan. */
  viewportSpread?: boolean
  /** Clustered scatter: number of groves spread across the overscan (0 = uniform). */
  clusters?: number
  /** Half-width (viewBox px) of a grove's triangular scatter around its centre. */
  clusterSpread?: number
  /** Fraction of trees dropped as lone strays in the clearings between groves. */
  strayFraction?: number
}

export interface MistBandConfig {
  cx: number
  cy: number
  rx: number
  ry: number
}

export interface LandscapeConfig {
  seed: number
  /**
   * Layer width as a fraction of the 1440 viewBox (centred). 2.8 > 1/0.45,
   * so scaling the foreground down at p=0 can never reveal a side edge.
   */
  overscan: number
  mountains: {
    a: MountainLayerConfig
    b: MountainLayerConfig
    c: MountainLayerConfig
  }
  trees: {
    far: TreeLayerConfig
    mid: TreeLayerConfig
    near: TreeLayerConfig
  }
  mist: MistBandConfig[]
}

export const LANDSCAPE: LandscapeConfig = {
  seed: 1337,
  overscan: 2.8,
  mountains: {
    a: { ridgeY: 400, amplitude: 150, segments: 38, roughness: 0.7 },
    b: { ridgeY: 530, amplitude: 85, segments: 48, roughness: 0.4 },
    c: { ridgeY: 645, amplitude: 50, segments: 56, roughness: 0.25 },
  },
  trees: {
    // Far = left valley wall (high left), mid = right wall, near = counter-tilt.
    far: {
      count: 280,
      mobileCount: 140,
      scaleMin: 0.22,
      scaleMax: 0.34,
      groundY: 575,
      tilt: 90,
      wobble: 46,
      symbolId: 'scene-tree-1',
      clusters: 34,
      clusterSpread: 130,
      strayFraction: 0.12,
    },
    mid: {
      count: 125,
      mobileCount: 62,
      scaleMin: 0.45,
      scaleMax: 0.7,
      groundY: 690,
      tilt: -70,
      wobble: 34,
      symbolId: 'scene-tree-2',
      clusters: 18,
      clusterSpread: 110,
      strayFraction: 0.12,
    },
    near: {
      count: 0,
      mobileCount: 0,
      viewportSpread: true,
      scaleMin: 0.95,
      scaleMax: 1.45,
      groundY: 800,
      tilt: 55,
      wobble: 22,
      symbolId: 'scene-tree-3',
      cropBottom: true,
    },
  },
  mist: [
    { cx: 480, cy: 500, rx: 900, ry: 42 },
    { cx: 1020, cy: 605, rx: 960, ry: 36 },
    { cx: 620, cy: 720, rx: 1050, ry: 28 },
  ],
}

/** Base tree height (viewBox px) at scale = 1. */
export const TREE_BASE_H = 100

export function overscanBounds(config: LandscapeConfig = LANDSCAPE): {
  x0: number
  x1: number
  width: number
} {
  const width = 1440 * config.overscan
  const x0 = (1440 - width) / 2
  return { x0, x1: x0 + width, width }
}
