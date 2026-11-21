import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { CSSProperties, KeyboardEvent } from 'react'
import { DEPTH, clamp01, easeInOut, fireStrength, layerY, mousePx } from './cameraConfig'
import { CONTACT_CONFIG } from './contactConfig'
import { COMPACT_GROUND_Y, GROUND_Y } from './foregroundGroundGeometry'
import { useIsCompactViewport } from './hooks'
import { SCENE_PALETTES, paletteToCssVars } from './sceneTheme'
import { useSceneTheme } from './scene-theme-context'
import ContactModal from './ContactModal'

const REVEAL_AT = 0.86
const TEXT_START = 0.88
const TEXT_END = 0.93

/** Preferred viewBox spot on the foreground grass: just past the camp grove. */
const MILESTONE_X = { desktop: 1350, compact: 980 } as const
const MILESTONE_SCALE = 0.7
const STONE_HALF_W = 34

const [THANKS_FIRST, THANKS_SECOND] = CONTACT_CONFIG.thanksLine.split('. ')

interface Mouse {
  x: MotionValue<number>
  y: MotionValue<number>
}

/** Clamp the preferred x into the slice's actually-visible viewBox range. */
function useMilestoneX(compact: boolean): number {
  const compute = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const scale = Math.max(vw / 1440, vh / 900)
    const halfVisible = vw / scale / 2
    const min = 720 - halfVisible + STONE_HALF_W
    const max = 720 + halfVisible - STONE_HALF_W
    const preferred = compact ? MILESTONE_X.compact : MILESTONE_X.desktop
    return Math.round(Math.min(max, Math.max(min, preferred)))
  }, [compact])

  const [x, setX] = useState(compute)

  useEffect(() => {
    const onResize = () => setX(compute())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [compute])

  return x
}

/**
 * Trail milestone stone near the camp, revealed at the end of the scroll.
 * Drawn in the same viewBox and with the same ground-locked drift/zoom as the
 * bike and rider, so its base stays welded to the foreground grass. Rendered
 * in its own SVG layer (outside the aria-hidden scene art) to stay a real,
 * focusable control for the contact modal.
 */
export default function ContactMilestone({
  progress,
  mouse,
}: {
  progress: MotionValue<number>
  mouse: Mouse
}) {
  const { sceneTheme } = useSceneTheme()
  const compact = useIsCompactViewport()
  const reduced = useReducedMotion()
  const mx = useMilestoneX(compact)
  const [open, setOpen] = useState(false)
  // Once revealed at the end of the page, the milestone stays put — scrolling
  // back up must not make it vanish again.
  const [revealed, setRevealed] = useState(() => progress.get() >= REVEAL_AT)
  const revealedRef = useRef(revealed)
  const groupRef = useRef<SVGGElement>(null)

  const y = useTransform(progress, (p) => layerY(DEPTH.camp, p))
  const textOpacity = useTransform(
    progress,
    (p) => Math.min(1, Math.max(0, (p - TEXT_START) / (TEXT_END - TEXT_START))),
  )
  // Same wash the near subjects carry up top: hazy on first appearance,
  // resolving to crisp as the page bottoms out.
  const clarity = useTransform(progress, (p) =>
    easeInOut(clamp01((p - REVEAL_AT) / (1 - REVEAL_AT))),
  )
  const hazeOpacity = useTransform(clarity, (c) => 0.42 + 0.58 * c)
  const hazeBlur = useTransform(clarity, (c) => `blur(${((1 - c) * 1.8).toFixed(2)}px)`)
  const fireRim = useTransform(progress, (p) => fireStrength(p) * 0.5)
  const xMouse = useTransform(mouse.x, (v) => v * mousePx(DEPTH.camp))
  const yMouse = useTransform(mouse.y, (v) => v * mousePx(DEPTH.camp) * 0.5)

  const gy = compact ? COMPACT_GROUND_Y : GROUND_Y

  // Same 0.94 → 1 scroll zoom as the camp, scaled about the stone's ground
  // point so the base never leaves the grass line.
  const applyZoom = useCallback(
    (p: number) => {
      const z = (reduced ? 1 : 0.94 + 0.06 * easeInOut(p)) * MILESTONE_SCALE
      groupRef.current?.setAttribute(
        'transform',
        `translate(${mx} ${gy.toFixed(1)}) scale(${z.toFixed(4)})`,
      )
    },
    [mx, gy, reduced],
  )

  useEffect(() => {
    applyZoom(progress.get())
  }, [progress, applyZoom])
  useMotionValueEvent(progress, 'change', applyZoom)

  useMotionValueEvent(progress, 'change', (p) => {
    if (!revealedRef.current && p >= REVEAL_AT) {
      revealedRef.current = true
      setRevealed(true)
    }
  })

  const interactive = revealed || open
  const vars = paletteToCssVars(SCENE_PALETTES[sceneTheme]) as CSSProperties

  const activate = () => {
    if (interactive) setOpen(true)
  }
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      activate()
    }
  }

  return (
    <>
      <motion.div
        className="scene-milestone-layer"
        data-scene={sceneTheme}
        style={vars}
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
          <defs>
            <linearGradient id="scene-milestone-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--stone-top)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--stone-bottom)' }} />
            </linearGradient>
            <radialGradient id="scene-milestone-glow">
              <stop offset="0%" style={{ stopColor: 'var(--camp-accent)', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: 'var(--camp-accent)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          <motion.g style={{ x: xMouse, y: yMouse }}>
            <motion.g style={{ y }}>
              <g ref={groupRef} transform={`translate(${mx} ${gy})`}>
                <motion.g style={{ opacity: hazeOpacity, filter: hazeBlur }}>
                  <g
                    className="scene-milestone"
                    role="button"
                    tabIndex={interactive ? 0 : -1}
                    aria-disabled={!interactive}
                    aria-haspopup="dialog"
                    aria-label="Let's connect — open contact details"
                    onClick={activate}
                    onKeyDown={onKeyDown}
                  >
                    <motion.g style={{ opacity: textOpacity }}>
                      <text className="scene-stone-thanks" x="0" y="-150" textAnchor="middle">
                        <tspan x="0">{THANKS_FIRST}.</tspan>
                        <tspan x="0" dy="19">
                          {THANKS_SECOND}
                        </tspan>
                      </text>
                    </motion.g>

                    {/* Contact shadow falls away from the upper-left light. */}
                    <ellipse className="scene-stone-shadow" cx="16" cy="5" rx="62" ry="9" />
                    <ellipse className="scene-stone-glow" cx="0" cy="-42" rx="80" ry="82" />
                    <ellipse className="scene-stone-mound" cx="0" cy="3" rx="56" ry="10" />

                    {/* One pillar: right face + cap join the front silhouette. */}
                    <path className="scene-stone-side" d="M42 0 L58 -8 L51 -86 L35 -78 Z" />
                    <path
                      className="scene-stone-top"
                      d="M-35 -78 Q-35 -96 -17 -96 H17 Q35 -96 35 -78 L51 -86 Q51 -104 33 -104 H-1 Q-19 -104 -19 -86 Z"
                    />
                    <path
                      className="scene-stone-body"
                      d="M-42 0 L-35 -78 Q-35 -96 -17 -96 H17 Q35 -96 35 -78 L42 0 Z"
                    />

                    {/* Quiet stone wear: hairline cracks and a few speckles. */}
                    <g className="scene-stone-wear" aria-hidden="true">
                      <path d="M-26 -78 q7 -4 12 -12" />
                      <path d="M19 -39 q-5 -6 -3 -12" />
                      <path d="M-15 -23 q4 -5 9 -6" />
                      <circle cx="-23" cy="-58" r="1.3" />
                      <circle cx="25" cy="-72" r="1" />
                      <circle cx="-8" cy="-33" r="1.1" />
                    </g>

                    {/* Painted band wraps front → side on matching curves. */}
                    <path
                      className="scene-stone-band-side"
                      d="M36 -66 Q44 -70 52 -74 L54 -54 Q46 -50 38 -46 Z"
                    />
                    <path className="scene-stone-band" d="M-36 -66 Q0 -69 36 -66 L38 -46 Q0 -43 -38 -46 Z" />
                    <text className="scene-stone-band-text" x="0" y="-53" textAnchor="middle">
                      KM 0
                    </text>

                    <g className="scene-stone-carve">
                      <text className="scene-stone-carve-shadow" x="0.7" y="-27.3" textAnchor="middle">
                        LET&apos;S
                      </text>
                      <text className="scene-stone-label" x="0" y="-28" textAnchor="middle">
                        LET&apos;S
                      </text>
                      <text className="scene-stone-carve-shadow" x="0.7" y="-11.3" textAnchor="middle">
                        CONNECT
                      </text>
                      <text className="scene-stone-label" x="0" y="-12" textAnchor="middle">
                        CONNECT
                      </text>
                    </g>

                    {sceneTheme === 'night' && (
                      <motion.path
                        className="scene-stone-fire-rim"
                        d="M-42 0 L-35 -78 Q-35 -96 -17 -96"
                        style={{ opacity: fireRim }}
                      />
                    )}

                    {/* Grass overlaps the base so the stone sits in the ground. */}
                    <g className="scene-stone-grass" aria-hidden="true">
                      <path d="M-34 4 q-3 -12 -8 -17 q7 4 10 17 Z" />
                      <path d="M-18 6 q1 -11 -3 -16 q7 5 7 16 Z" />
                      <path d="M22 5 q4 -11 10 -15 q-4 8 -8 15 Z" />
                      <path d="M38 3 q5 -9 11 -11 q-5 7 -9 11 Z" />
                    </g>
                  </g>
                </motion.g>
              </g>
            </motion.g>
          </motion.g>
        </svg>
      </motion.div>

      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
