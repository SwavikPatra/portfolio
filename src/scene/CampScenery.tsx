import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { easeInOut } from './cameraConfig'
import { useSceneTheme } from './scene-theme-context'

import tree1Raw from './tree1.svg?raw'
import tree3Raw from './tree3.svg?raw'
import tentRaw from './tent.svg?raw'

// ----- shared strip-helper (identical to Bike.tsx) -----
function strip(raw: string, fill = 'currentColor') {
  return raw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/g, '')
    .replace(/<\/?svg[^>]*>/g, '')
    .replace(/fill="#000000"/g, `fill="${fill}"`)
    .trim()
}

// Tree art is recoloured by a vertical gradient in each source's flipped path space.
const pineMarkup = strip(tree1Raw, 'url(#camp-pine-fill)')
const oakMarkup = strip(tree3Raw, 'url(#camp-oak-fill)')
const oakTrunkMarkup = strip(tree3Raw, 'var(--camp-trunk)')
const tentMarkup = strip(tentRaw)
  .replace(/fill="rgb\([^)]*\)"/g, 'fill="currentColor"')
  .replace(
    /M 0\.00 250\.00 L 0\.00 0\.00 L 250\.00 0\.00 L 500\.00 0\.00 L 500\.00 250\.00 L 500\.00 500\.00 L 250\.00 500\.00 L 0\.00 500\.00 L 0\.00 250\.00 Z/,
    '',
  )

// ======================
// CampTrees – a small grove of tree1 (pine) + tree3 (oak), always mounted
// ======================
// Local coords, ground line y=148. Each entry: source markup + transform that
// drops its content bbox bottom onto the ground at the requested height/x.
// tree1 content bbox x 115..297, y 44..460; tree3 x 15..439, y 16..662.
const CAMP_TREES = [
  { markup: pineMarkup, s: 0.553, tx: -264, ty: -106.3 },
  { markup: oakMarkup, s: 0.4025, tx: 38.6, ty: -118.5 },
  { markup: pineMarkup, s: 0.433, tx: 241, ty: -51 },
] as const

export function CampTrees() {
  return (
    <g className="scene-camp-trees" aria-hidden="true">
      <defs>
        <linearGradient
          id="camp-pine-fill"
          className="scene-camp-tree-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="4420"
          x2="0"
          y2="260"
        >
          <stop offset="0" style={{ stopColor: 'var(--camp-foliage)' }} />
          <stop offset="0.86" style={{ stopColor: 'var(--camp-foliage)' }} />
          <stop offset="0.94" style={{ stopColor: 'var(--camp-trunk)' }} />
          <stop offset="1" style={{ stopColor: 'var(--camp-trunk)' }} />
        </linearGradient>
        <linearGradient
          id="camp-oak-fill"
          className="scene-camp-tree-grad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="6600"
          x2="0"
          y2="140"
        >
          <stop offset="0" style={{ stopColor: 'var(--camp-foliage)' }} />
          <stop offset="0.4" style={{ stopColor: 'var(--camp-foliage)' }} />
          <stop offset="0.46" style={{ stopColor: 'var(--camp-trunk)' }} />
          <stop offset="1" style={{ stopColor: 'var(--camp-trunk)' }} />
        </linearGradient>
        <clipPath id="camp-oak-trunk-clip">
          <path d="M205 105 L214 105 L228 140 L231 200 L236 230 L236 290 L236 330 L190 330 L195 290 L198 230 L198 200 L205 140 Z" />
        </clipPath>
      </defs>
      {CAMP_TREES.map((tree, i) => (
        <g
          key={i}
          transform={`translate(${tree.tx} ${tree.ty}) scale(${tree.s})`}
          className="scene-camp-tree"
        >
          <g dangerouslySetInnerHTML={{ __html: tree.markup }} />
          {i === 1 && (
            <g clipPath="url(#camp-oak-trunk-clip)" dangerouslySetInnerHTML={{ __html: oakTrunkMarkup }} />
          )}
        </g>
      ))}
    </g>
  )
}

// ======================
// CampTent – tent.svg, evening + night only
// ======================
// Placement (tent local coords, ground line y=148):
// Scale so width ≈ 185 → S ≈ 0.391
// TY = 148 - S * 380 ≈ -0.6
// TX = -185.5 so left edge ≈ -180
// Content bbox: x 14..487, y 123..380 (w 473, h 257) in a 500x500 viewBox
const TENT_S = 185 / 473 // ≈ 0.391
const TENT_TX = -185.5
const TENT_TY = -0.6

const TENT_PLANES = {
  far: 'M175 150 L100 350 L175 355 Z',
  front: 'M175 150 L277 327 L175 355 Z',
  roof: 'M175 150 L315 175 L410 327 L277 327 Z',
  skirt: 'M277 327 L410 327 L390 363 L277 363 Z',
} as const

const TENT_LINES = {
  pole: 'M175 150 L175 355',
  brace: 'M190 190 L277 340',
  guyLeft: 'M175 150 L100 350',
  edge: 'M325 172 L410 327',
  guyRight: 'M325 172 L476 362',
  guyLow: 'M410 327 L476 362',
  ridge: 'M175 150 L315 175',
  rim: 'M325 172 L410 327 L390 360',
} as const

const TENT_GRASS = [
  'M122 366 q1 -8 4 -12',
  'M148 367 q-2 -9 1 -13',
  'M205 368 q2 -7 5 -11',
  'M258 368 q-1 -8 2 -12',
  'M312 367 q2 -9 5 -12',
  'M366 366 q-2 -8 1 -11',
  'M404 364 q2 -7 5 -10',
] as const

function LitTentArt() {
  return (
    <g className="scene-tent-lit">
      <defs>
        <radialGradient id="tent-lantern-grad" cx="46%" cy="80%" r="80%">
          <stop offset="0%" style={{ stopColor: 'var(--fire-core)' }} />
          <stop offset="24%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.94 }} />
          <stop offset="62%" style={{ stopColor: 'var(--camp-tent)' }} />
          <stop
            offset="100%"
            style={{
              stopColor: 'color-mix(in srgb, var(--camp-tent) 60%, var(--camp-ink))',
            }}
          />
        </radialGradient>
        <linearGradient
          id="tent-roof-grad"
          gradientUnits="userSpaceOnUse"
          x1="175"
          y1="150"
          x2="410"
          y2="327"
        >
          <stop
            offset="0%"
            style={{
              stopColor: 'color-mix(in srgb, var(--camp-tent) 48%, var(--camp-ink))',
            }}
          />
          <stop offset="55%" style={{ stopColor: 'var(--camp-tent)' }} />
          <stop
            offset="100%"
            style={{ stopColor: 'color-mix(in srgb, var(--fire) 30%, var(--camp-tent))' }}
          />
        </linearGradient>
        <clipPath id="tent-roof-clip">
          <path d={TENT_PLANES.roof} />
        </clipPath>
        <radialGradient id="tent-roof-glow-grad" cx="22%" cy="94%" r="72%">
          <stop offset="0%" style={{ stopColor: 'var(--fire-core)', stopOpacity: 0.62 }} />
          <stop offset="45%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.24 }} />
          <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient
          id="tent-far-grad"
          gradientUnits="userSpaceOnUse"
          x1="175"
          y1="150"
          x2="100"
          y2="355"
        >
          <stop
            offset="0%"
            style={{ stopColor: 'color-mix(in srgb, var(--camp-ink) 78%, var(--haze))' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'color-mix(in srgb, var(--camp-tent) 52%, var(--camp-ink))' }}
          />
        </linearGradient>
        <linearGradient
          id="tent-skirt-grad"
          gradientUnits="userSpaceOnUse"
          x1="277"
          y1="327"
          x2="390"
          y2="363"
        >
          <stop
            offset="0%"
            style={{ stopColor: 'color-mix(in srgb, var(--camp-tent) 46%, var(--camp-ink))' }}
          />
          <stop
            offset="100%"
            style={{ stopColor: 'color-mix(in srgb, var(--fire) 20%, var(--camp-tent))' }}
          />
        </linearGradient>
        <radialGradient id="tent-pool-grad">
          <stop offset="0%" style={{ stopColor: 'var(--fire-core)', stopOpacity: 0.5 }} />
          <stop offset="45%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="tent-shadow-grad">
          <stop offset="0%" style={{ stopColor: 'var(--camp-ink)', stopOpacity: 0.72 }} />
          <stop offset="70%" style={{ stopColor: 'var(--camp-ink)', stopOpacity: 0.34 }} />
          <stop offset="100%" style={{ stopColor: 'var(--camp-ink)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient
          id="tent-rim-grad"
          gradientUnits="userSpaceOnUse"
          x1="325"
          y1="172"
          x2="410"
          y2="340"
        >
          <stop offset="0%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.62 }} />
          <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.14 }} />
        </linearGradient>
      </defs>

      <ellipse cx="250" cy="368" rx="180" ry="15" fill="url(#tent-shadow-grad)" />
      <ellipse
        className="scene-tent-lantern"
        cx="250"
        cy="361"
        rx="126"
        ry="20"
        fill="url(#tent-pool-grad)"
      />

      <path d={TENT_PLANES.far} fill="url(#tent-far-grad)" />
      <path d={TENT_PLANES.roof} fill="url(#tent-roof-grad)" />
      <path
        d={TENT_PLANES.roof}
        fill="url(#tent-roof-glow-grad)"
        clipPath="url(#tent-roof-clip)"
      />
      <path d={TENT_PLANES.skirt} fill="url(#tent-skirt-grad)" />
      <path
        className="scene-tent-lantern"
        d={TENT_PLANES.front}
        fill="url(#tent-lantern-grad)"
      />

      <g
        fill="none"
        stroke="color-mix(in srgb, var(--camp-tent) 74%, var(--camp-ink))"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.72"
      >
        <path d={TENT_LINES.pole} />
        <path d={TENT_LINES.brace} />
        <path d={TENT_LINES.guyLeft} />
        <path d={TENT_LINES.edge} />
        <path d={TENT_LINES.guyRight} />
        <path d={TENT_LINES.guyLow} />
      </g>
      <path
        d={TENT_LINES.ridge}
        fill="none"
        stroke="var(--star)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.38"
      />
      <path
        d={TENT_LINES.rim}
        fill="none"
        stroke="url(#tent-rim-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <g
        fill="var(--camp-trunk)"
        opacity="0.9"
      >
        <rect x="96" y="346" width="7" height="4" rx="1" transform="rotate(-18 99 348)" />
        <rect x="472" y="358" width="8" height="4" rx="1" transform="rotate(24 476 360)" />
        <rect x="406" y="354" width="7" height="4" rx="1" transform="rotate(70 409 356)" />
      </g>
      <g
        fill="none"
        stroke="color-mix(in srgb, var(--grass) 62%, var(--camp-ink))"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      >
        {TENT_GRASS.map((blade) => (
          <path key={blade} d={blade} />
        ))}
      </g>
    </g>
  )
}

export function CampTent() {
  const { sceneTheme } = useSceneTheme()
  return (
    <g
      transform={`translate(${TENT_TX} ${TENT_TY}) scale(${TENT_S})`}
      className="scene-night-tent"
      style={{ color: 'var(--camp-tent)' }}
    >
      {sceneTheme === 'night' || sceneTheme === 'sunset' ? (
        <LitTentArt />
      ) : (
        <g dangerouslySetInnerHTML={{ __html: tentMarkup }} />
      )}
    </g>
  )
}

// ======================
// CampGlow – large ambient glow, night only, behind all art
// ======================
// The glow grows and brightens with the same p that drives the descent, so a
// closer camp reads as a closer, warmer fire. Centre it between firepit and
// rider and stretch it wide enough to light the air behind him.
const GLOW_CX = 180
const GLOW_CY = 130
const GLOW_RX = 430
const GLOW_RY = 215

interface CampGlowProps {
  ignite: MotionValue<number>
  progress: MotionValue<number>
  sceneTheme: ReturnType<typeof useSceneTheme>['sceneTheme']
}

export function CampGlow({ ignite, progress, sceneTheme }: CampGlowProps) {
  // Hooks run unconditionally — only the render below is theme-gated.
  const scale = useTransform(progress, (p) => 0.7 + 0.6 * easeInOut(p))
  const brightness = useTransform([ignite, progress], (latest: number[]) =>
    latest[0] * (0.45 + 0.55 * easeInOut(latest[1])),
  )

  if (sceneTheme !== 'night') return null

  return (
    <motion.g style={{ scale, opacity: brightness }}>
      <ellipse
        cx={GLOW_CX}
        cy={GLOW_CY}
        rx={GLOW_RX}
        ry={GLOW_RY}
        fill="url(#scene-camp-air-glow-grad)"
        className="scene-camp-glow"
      />
    </motion.g>
  )
}