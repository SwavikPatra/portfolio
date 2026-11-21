import { LANDSCAPE, TREE_BASE_H, mulberry32, overscanBounds } from './landscapeConfig'
import type { LandscapeConfig, MistBandConfig, MountainLayerConfig, TreeLayerConfig } from './landscapeConfig'
import tree1Raw from './tree1.svg?raw'
import tree2Raw from './tree2.svg?raw'
import tree3Raw from './tree3.svg?raw'
import tree4Raw from './tree4.svg?raw'

const VIEW_H = 900
const VIEW_W = 1440

export interface TreeInstance {
  x: number
  y: number
  h: number
  w: number
  symbolId: string
}

export interface TreeBand {
  /** Closed ground fill that the trees are rooted to. */
  ground: string
  trees: TreeInstance[]
}

export interface GeneratedLandscape {
  mountains: { a: string; b: string; c: string; ground: string }
  mist: MistBandConfig[]
  trees: { far: TreeBand; mid: TreeBand; near: TreeBand }
}

// ---------------------------------------------------------------------------
// Ridge paths — flat fills only, closed at the bottom edge.
// ---------------------------------------------------------------------------

function distantRidgePath(rand: () => number, x0: number, x1: number, cfg: MountainLayerConfig): string {
  const span = x1 - x0
  const peak1x = x0 + span * (0.38 + rand() * 0.05)
  const peak2x = x0 + span * (0.6 + rand() * 0.05)
  const valleyX = peak1x + (peak2x - peak1x) * (0.45 + rand() * 0.1)
  const peak1y = cfg.ridgeY - cfg.amplitude * (0.48 + rand() * 0.1)
  const peak2y = cfg.ridgeY - cfg.amplitude * (0.42 + rand() * 0.1)
  const valleyY = cfg.ridgeY - cfg.amplitude * (0.08 + rand() * 0.04)
  const c = (v: number) => v.toFixed(1)

  let d = `M${c(x0)} ${c(cfg.ridgeY)}`
  d += ` C${c(x0 + span * 0.06)} ${c(cfg.ridgeY)} ${c(peak1x - span * 0.02)} ${c(peak1y + 10)} ${c(peak1x)} ${c(peak1y)}`
  d += ` C${c(peak1x + span * 0.02)} ${c(peak1y + 10)} ${c(valleyX - span * 0.01)} ${c(valleyY)} ${c(valleyX)} ${c(valleyY)}`
  d += ` C${c(valleyX + span * 0.01)} ${c(valleyY)} ${c(peak2x - span * 0.02)} ${c(peak2y + 10)} ${c(peak2x)} ${c(peak2y)}`
  d += ` C${c(peak2x + span * 0.02)} ${c(peak2y + 10)} ${c(x1 - span * 0.06)} ${c(cfg.ridgeY)} ${c(x1)} ${c(cfg.ridgeY)}`
  d += ` L${c(x1)} ${VIEW_H} L${c(x0)} ${VIEW_H} Z`
  return d
}

/** Layered sines + light noise — smooth shoulders, still seeded. */
function rollingRidge(rand: () => number, x0: number, x1: number, cfg: MountainLayerConfig): [number, number][] {
  const pts: [number, number][] = []
  const n = Math.max(4, cfg.segments)
  const phase = rand() * Math.PI * 2
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = x0 + (x1 - x0) * t
    const edge = Math.sin(t * Math.PI) ** 0.7
    const wave =
      Math.sin(t * Math.PI * 2.4 + phase) * 0.55 +
      Math.sin(t * Math.PI * 5.2 + phase * 0.6) * 0.3 +
      Math.sin(t * Math.PI * 9.1 + 1.7) * 0.15
    const noise = (rand() - 0.5) * cfg.roughness
    const y = cfg.ridgeY - (wave + noise) * cfg.amplitude * edge
    pts.push([x, y])
  }
  return pts
}

function polylineToPath(pts: [number, number][], bottomY: number): string {
  if (pts.length < 2) return ''
  const [first, ...rest] = pts
  let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)}`
  for (const [x, y] of rest) d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
  const last = pts[pts.length - 1]
  d += ` L${last[0].toFixed(1)} ${bottomY} L${first[0].toFixed(1)} ${bottomY} Z`
  return d
}

function rollingPath(pts: [number, number][], bottomY: number): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const mx = (x0 + x1) / 2
    d += ` Q${x0.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`
    if (i === pts.length - 2) d += ` T${x1.toFixed(1)} ${y1.toFixed(1)}`
  }
  const last = pts[pts.length - 1]
  const first = pts[0]
  d += ` L${last[0].toFixed(1)} ${bottomY} L${first[0].toFixed(1)} ${bottomY} Z`
  return d
}

function groundPath(rand: () => number, x0: number, x1: number, baseY: number): string {
  const pts: [number, number][] = []
  const n = 12
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = x0 + (x1 - x0) * t
    const y = baseY + (rand() - 0.5) * 14
    pts.push([x, y])
  }
  return polylineToPath(pts, VIEW_H)
}

// ---------------------------------------------------------------------------
// Trees — one silhouette per layer, scattered along a tilted valley wall.
// ---------------------------------------------------------------------------

const TREE_SOURCES = [
  { id: 'scene-tree-1', raw: tree1Raw, vbW: 411, vbH: 486 },
  { id: 'scene-tree-2', raw: tree2Raw, vbW: 403, vbH: 700 },
  { id: 'scene-tree-3', raw: tree3Raw, vbW: 453, vbH: 676 },
  { id: 'scene-tree-4', raw: tree4Raw, vbW: 351, vbH: 569 },
] as const

/** Strip Figma/Inkscape wrapper; recolour flat black → currentColor. */
export function treeSymbolMarkup(raw: string): string {
  return raw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/g, '')
    .replace(/<\/?svg[^>]*>/g, '')
    .replace(/fill="#000000"/g, 'fill="currentColor"')
    .trim()
}

export function treeSources() {
  return TREE_SOURCES
}

/**
 * Ground Y at absolute x across [x0, x1]. The same function drives both the
 * drawn ground fill and the tree roots, so trees can never float off the wall.
 * Straight tilt + three harmonics = rolling mountain slope instead of a ruler.
 */
export function treeGroundY(
  cfg: TreeLayerConfig,
  x: number,
  x0: number,
  x1: number,
  phase: number,
): number {
  const t = (x - x0) / (x1 - x0)
  const tilt = cfg.tilt * (t - 0.5)
  const wave =
    Math.sin(t * Math.PI * 2 + phase) * 0.55 +
    Math.sin(t * Math.PI * 5.1 + phase * 1.6) * 0.28 +
    Math.sin(t * Math.PI * 9.7 + phase * 0.7) * 0.17
  return cfg.groundY + tilt + wave * cfg.wobble
}

/** Smooth open path through sampled points (quadratic midpoint easing). */
function smoothThrough(pts: [number, number][]): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [cx, cy] = pts[i]
    const [nx, ny] = pts[i + 1]
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${((cx + nx) / 2).toFixed(1)} ${((cy + ny) / 2).toFixed(1)}`
  }
  const last = pts[pts.length - 1]
  d += ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`
  return d
}

/** Solid ground-fill path under the treeline — samples the exact root curve. */
export function treeGroundBand(
  cfg: TreeLayerConfig,
  x0: number,
  x1: number,
  bottomY: number,
  phase: number,
): string {
  const margin = 160
  const samples = Math.max(32, Math.round((x1 - x0) / 36))
  const pts: [number, number][] = []
  for (let i = 0; i <= samples; i++) {
    const x = x0 - margin + ((x1 - x0 + margin * 2) * i) / samples
    pts.push([x, treeGroundY(cfg, x, x0, x1, phase)])
  }
  return (
    smoothThrough(pts) +
    ` L${(x1 + margin).toFixed(1)} ${bottomY} L${(x0 - margin).toFixed(1)} ${bottomY} Z`
  )
}

function scatterTrees(
  rand: () => number,
  cfg: TreeLayerConfig,
  x0: number,
  x1: number,
  compact: boolean,
  phase: number,
): TreeInstance[] {
  const count = compact ? cfg.mobileCount : cfg.count
  const src = TREE_SOURCES.find((s) => s.id === cfg.symbolId) ?? TREE_SOURCES[0]
  const trees: TreeInstance[] = []
  const inset = 40
  const span = x1 - x0 - inset * 2

  // Mountain bands read as an even carpet when x is sampled uniformly at high
  // counts. Scatter around a handful of groves instead: dense pockets, bare
  // clearings, plus a few lone strays. Same seeded rand → still deterministic.
  const clusterCount = cfg.clusters ?? 0
  const spread = cfg.clusterSpread ?? 120
  const strayFraction = cfg.strayFraction ?? 0
  const centers: number[] = []
  for (let i = 0; i < clusterCount; i++) centers.push(x0 + inset + rand() * span)

  for (let i = 0; i < count; i++) {
    const scale = cfg.scaleMin + rand() * (cfg.scaleMax - cfg.scaleMin)
    const h = TREE_BASE_H * scale
    const w = h * (src.vbW / src.vbH)
    let x: number
    if (cfg.viewportSpread) {
      // With only a handful of near trees, random overscan placement would
      // leave the visible frame empty — space them across it with slight jitter.
      const from = compact ? 430 : inset
      const to = compact ? 1010 : VIEW_W - inset
      const slot = (i + 0.5) / count
      x = from + slot * (to - from) + (rand() - 0.5) * ((to - from) / count) * 0.4
    } else if (clusterCount > 0) {
      if (rand() < strayFraction) {
        x = x0 + inset + rand() * span
      } else {
        // Sum of two uniforms → triangular density: most trees hug the centre.
        const c = centers[Math.floor(rand() * clusterCount)]
        x = c + (rand() + rand() - 1) * spread
      }
    } else {
      x = x0 + inset + rand() * span
    }
    // Root on the same curve the ground fill is drawn from, sunk a few px so
    // trunks sit in the slope rather than floating on a ruler-straight line.
    const y = treeGroundY(cfg, x, x0, x1, phase) + rand() * 5
    trees.push({ x, y, h, w, symbolId: src.id })
  }
  // Painter’s order: smaller (farther) first so larger read in front.
  trees.sort((a, b) => a.h - b.h)
  return trees
}

// ---------------------------------------------------------------------------
// Public generator — pure, memoised by callers on (seed, compact).
// ---------------------------------------------------------------------------

export function generateLandscape(
  seed: number = LANDSCAPE.seed,
  compact = false,
  config: LandscapeConfig = LANDSCAPE,
): GeneratedLandscape {
  const { x0, x1 } = overscanBounds(config)
  // Distinct streams per feature so tweaking one doesn’t reshuffle others.
  const root = mulberry32(seed)
  const seedA = Math.floor(root() * 0xffffffff)
  const seedB = Math.floor(root() * 0xffffffff)
  const seedC = Math.floor(root() * 0xffffffff)
  const seedG = Math.floor(root() * 0xffffffff)
  const seedTF = Math.floor(root() * 0xffffffff)
  const seedTM = Math.floor(root() * 0xffffffff)
  const seedTN = Math.floor(root() * 0xffffffff)
  const seedPF = Math.floor(root() * 0xffffffff)
  const seedPM = Math.floor(root() * 0xffffffff)
  const seedPN = Math.floor(root() * 0xffffffff)

  const ridgeB = rollingRidge(mulberry32(seedB), x0, x1, config.mountains.b)
  const ridgeC = rollingRidge(mulberry32(seedC), x0, x1, config.mountains.c)

  const buildBand = (
    cfg: TreeLayerConfig,
    treeSeed: number,
    phaseSeed: number,
  ): TreeBand => {
    const phase = mulberry32(phaseSeed)() * Math.PI * 2
    return {
      ground: treeGroundBand(cfg, x0, x1, cfg.cropBottom ? 960 : 900, phase),
      trees: scatterTrees(mulberry32(treeSeed), cfg, x0, x1, compact, phase),
    }
  }

  return {
    mountains: {
      a: distantRidgePath(mulberry32(seedA), x0, x1, config.mountains.a),
      b: rollingPath(ridgeB, VIEW_H),
      c: rollingPath(ridgeC, VIEW_H),
      ground: groundPath(mulberry32(seedG), x0, x1, 830),
    },
    mist: config.mist,
    trees: {
      far: buildBand(config.trees.far, seedTF, seedPF),
      mid: buildBand(config.trees.mid, seedTM, seedPM),
      near: buildBand(config.trees.near, seedTN, seedPN),
    },
  }
}
