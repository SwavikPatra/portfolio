import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion, useTransform } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { MotionValue } from 'framer-motion'
import { easeInOut, hazeAmount } from './cameraConfig'
import { SCENE_EFFECTS } from './sceneTheme'
import type { SceneThemeId } from './sceneTheme'

// Deterministic pseudo-random in [0,1) — stable across re-mounts.
function rnd(i: number, salt = 0) {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return v - Math.floor(v)
}

// ---------------------------------------------------------------------------
// Sky-bound effects: stars + meteor shower (night), clouds (noon), birds.
// Rendered BEHIND the mountain layers so they read as distant.
// ---------------------------------------------------------------------------

const STAR_GROUPS = 8

const METEOR_COUNT = 14

/** Night-only shower: each meteor loops on its own long cycle, with short,
 *  staggered delays so they arrive in bursts instead of a steady stream. */
function MeteorShower() {
  const groupRef = useRef<SVGGElement>(null)

  const meteors = useMemo(
    () =>
      Array.from({ length: METEOR_COUNT }, (_, i) => ({
        x: 480 + rnd(i, 61) * 1000,
        y: 20 + rnd(i, 62) * 280,
        angle: 150 + rnd(i, 63) * 24,
        length: 42 + rnd(i, 64) * 88,
        cycle: 11 + rnd(i, 65) * 6,
        delay: rnd(i, 66) * 4.5,
        travel: 340 + rnd(i, 67) * 220,
      })),
    [],
  )

  // CSS keeps animating off-screen; pause the whole shower when the tab hides.
  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    const sync = () => group.classList.toggle('is-paused', document.hidden)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  return (
    <g ref={groupRef} className="scene-meteors">
      {meteors.map((m, i) => (
        <g
          key={i}
          transform={`translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) rotate(${m.angle.toFixed(1)})`}
        >
          <g
            className="scene-meteor"
            style={
              {
                '--meteor-cycle': `${m.cycle.toFixed(2)}s`,
                '--meteor-delay': `${m.delay.toFixed(2)}s`,
                '--meteor-travel': `${m.travel.toFixed(0)}px`,
              } as CSSProperties
            }
          >
            <line
              x1={0}
              y1={0}
              x2={m.length}
              y2={0}
              stroke="url(#scene-meteor-grad)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle cx={m.length} cy={0} r={2.2} fill="var(--star)" />
          </g>
        </g>
      ))}
    </g>
  )
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        i,
        x: rnd(i, 11) * 1440,
        y: rnd(i, 12) * 430,
        r: 0.8 + rnd(i, 13) * 1.5,
      })),
    [],
  )

  // Twinkle a handful of groups instead of 64 individual circles: each animated
  // circle can become its own composited layer in Chrome, and dozens of them
  // repainting while the fixed scene scrolls shows up as blocky flicker.
  const groups = useMemo(
    () =>
      Array.from({ length: STAR_GROUPS }, (_, g) => ({
        stars: stars.filter((star) => star.i % STAR_GROUPS === g),
        dur: 1.8 + rnd(g, 14) * 3.4,
        delay: -rnd(g, 15) * 4,
      })),
    [stars],
  )

  return (
    <g className="scene-stars">
      {groups.map((group, g) => (
        <g
          key={g}
          className="scene-star-group"
          style={{ animationDuration: `${group.dur}s`, animationDelay: `${group.delay}s` }}
        >
          {group.stars.map((star) => (
            <circle
              key={star.i}
              className="scene-star"
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="var(--star)"
            />
          ))}
        </g>
      ))}
      <MeteorShower />
    </g>
  )
}

function Clouds() {
  return (
    <g className="scene-clouds">
      <g transform="translate(340 130)">
        <g className="scene-cloud" style={{ animationDuration: '46s' }}>
          <ellipse cx={0} cy={0} rx={64} ry={20} />
          <ellipse cx={-34} cy={-6} rx={34} ry={16} />
          <ellipse cx={34} cy={-4} rx={40} ry={17} />
          <ellipse cx={6} cy={-16} rx={34} ry={16} />
        </g>
      </g>
      <g transform="translate(1050 200)">
        <g className="scene-cloud" style={{ animationDuration: '64s', animationDelay: '-20s' }}>
          <ellipse cx={0} cy={0} rx={52} ry={16} />
          <ellipse cx={-30} cy={-5} rx={28} ry={13} />
          <ellipse cx={26} cy={-4} rx={32} ry={14} />
          <ellipse cx={4} cy={-13} rx={26} ry={13} />
        </g>
      </g>
      <g transform="translate(700 70)">
        <g className="scene-cloud" style={{ animationDuration: '80s', animationDelay: '-40s' }}>
          <ellipse cx={0} cy={0} rx={44} ry={13} />
          <ellipse cx={-24} cy={-4} rx={24} ry={11} />
          <ellipse cx={22} cy={-3} rx={26} ry={12} />
        </g>
      </g>
    </g>
  )
}

function Birds({ evening }: { evening: boolean }) {
  const count = evening ? 4 : 3
  return (
    <g className={`scene-birds${evening ? ' is-home' : ''}`}>
      {Array.from({ length: count }, (_, i) => (
        <g
          key={i}
          className="scene-bird"
          style={{
            animationDuration: `${30 + i * 7}s`,
            animationDelay: `${-i * 9}s`,
          }}
        >
          <path
            d="M0 0 q7 -7 14 0 q7 -7 14 0"
            transform={`translate(${rnd(i, 31) * 300} ${110 + rnd(i, 32) * 170 + i * 24})`}
            fill="none"
            stroke="var(--camp)"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  )
}

interface SkyEffectsProps {
  theme: SceneThemeId
}

export function SkyEffects({ theme }: SkyEffectsProps) {
  const fx = SCENE_EFFECTS[theme]
  return (
    <g className="scene-sky-effects" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.g
          key={`sky-${theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {fx.stars && <Stars />}
          {fx.clouds && <Clouds />}
          {fx.birds && <Birds evening={theme === 'sunset'} />}
        </motion.g>
      </AnimatePresence>
    </g>
  )
}

// ---------------------------------------------------------------------------
// Ground-bound effects: fireflies (rAF drift + mouse repulsion) and the
// morning ground mist. Rendered in FRONT of the camp.
// ---------------------------------------------------------------------------

function Fireflies({ count, mouseX, mouseY, progress }: {
  count: number
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  progress: MotionValue<number>
}) {
  const groupRef = useRef<SVGGElement | null>(null)
  // Same p as the camera: nearer fireflies are larger and brighter.
  const scale = useTransform(progress, (p) => 0.65 + 0.55 * easeInOut(p))
  const brightness = useTransform(progress, (p) => 0.5 + 0.5 * easeInOut(p))

  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    const nodes = Array.from(group.querySelectorAll('circle'))
    const flies = nodes.map((_, i) => ({
      bx: 500 + rnd(i, 41) * 900,
      by: 540 + rnd(i, 42) * 290,
      ax: 12 + rnd(i, 43) * 32,
      ay: 8 + rnd(i, 44) * 24,
      sx: 0.00016 + rnd(i, 45) * 0.00034,
      sy: 0.0002 + rnd(i, 46) * 0.0004,
      ph: rnd(i, 47) * Math.PI * 2,
      ps: 0.0011 + rnd(i, 48) * 0.0017,
      px: 0,
      py: 0,
    }))

    // Prime starting positions so nothing pops at (0,0).
    flies.forEach((f, i) => {
      nodes[i].setAttribute('cx', f.bx.toFixed(1))
      nodes[i].setAttribute('cy', f.by.toFixed(1))
    })

    let raf = 0
    const tick = (now: number) => {
      // Repulsion target: normalised pointer → viewBox space (approximate).
      const mx = ((mouseX.get() + 1) / 2) * 1440
      const my = ((mouseY.get() + 1) / 2) * 900

      for (let i = 0; i < flies.length; i++) {
        const f = flies[i]
        const node = nodes[i]
        let x = f.bx + Math.sin(now * f.sx + f.ph) * f.ax
        let y = f.by + Math.cos(now * f.sy + f.ph * 1.7) * f.ay

        // Gently pushed away from the pointer (radius 150 viewBox units).
        const dx = x - mx
        const dy = y - my
        const dist = Math.hypot(dx, dy) || 1
        const push = dist < 150 ? (150 - dist) / 150 : 0
        const targetPX = push > 0 ? (dx / dist) * push * 34 : 0
        const targetPY = push > 0 ? (dy / dist) * push * 34 : 0
        f.px += (targetPX - f.px) * 0.06
        f.py += (targetPY - f.py) * 0.06
        x += f.px
        y += f.py

        node.setAttribute('cx', x.toFixed(1))
        node.setAttribute('cy', y.toFixed(1))
        node.setAttribute(
          'opacity',
          (0.28 + 0.72 * (0.5 + 0.5 * Math.sin(now * f.ps + f.ph))).toFixed(2),
        )
      }
      // rAF is automatically suspended while the tab is hidden.
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, mouseX, mouseY])

  return (
    <motion.g style={{ scale, opacity: brightness }}>
      <g ref={groupRef} className="scene-fireflies">
        {Array.from({ length: count }, (_, i) => (
          <circle key={i} r={7} fill="url(#scene-fly-grad)" opacity={0} />
        ))}
      </g>
    </motion.g>
  )
}

/** Reduced motion: frozen dots, no drift loop. */
function StaticFireflies({ count }: { count: number }) {
  return (
    <g className="scene-fireflies">
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={500 + rnd(i, 41) * 900}
          cy={540 + rnd(i, 42) * 290}
          r={7}
          fill="url(#scene-fly-grad)"
          opacity={0.7}
        />
      ))}
    </g>
  )
}

// Low mist for morning + sunset: several slow, staggered banks, not one strip.
const GROUND_MIST = [
  { cx: 330, cy: 655, rx: 700, ry: 48 },
  { cx: 1110, cy: 700, rx: 760, ry: 52 },
  { cx: 620, cy: 760, rx: 900, ry: 62 },
  { cx: 1080, cy: 815, rx: 820, ry: 58 },
  { cx: 320, cy: 860, rx: 780, ry: 54 },
] as const

/** Present at the top, thinner mid-scroll, and returning around the camp. */
function groundMistAmount(p: number): number {
  const late = easeInOut(Math.max(0, (p - 0.58) / 0.42))
  return Math.min(1, hazeAmount(p) * 0.7 + late * 0.7)
}

function GroundMist({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, groundMistAmount)
  return (
    <motion.g style={{ opacity }}>
      {GROUND_MIST.map((band, i) => (
        <ellipse
          key={i}
          className="scene-ground-mist"
          cx={band.cx}
          cy={band.cy}
          rx={band.rx}
          ry={band.ry}
          fill="url(#scene-mist-grad)"
          style={{ animationDelay: `${-i * 6}s` }}
        />
      ))}
    </motion.g>
  )
}

// Wide, overlapping banks that veer across the whole near plane — trees,
// ground and camp alike — rather than sitting only over the subjects.
const FOREGROUND_MIST = [
  { cx: 300, cy: 585, rx: 660, ry: 95, opacity: 0.85 },
  { cx: 1130, cy: 635, rx: 700, ry: 100, opacity: 0.9 },
  { cx: 620, cy: 710, rx: 860, ry: 115, opacity: 1 },
  { cx: 1180, cy: 780, rx: 740, ry: 100, opacity: 0.9 },
  { cx: 360, cy: 840, rx: 800, ry: 105, opacity: 0.85 },
] as const

/** Soft veil across the entire foreground: thick while the camera is up,
 *  clear by the time the rider is reached. The mist drifts over the art
 *  instead of tinting it, so the dark silhouettes stay intact underneath. */
function ForegroundMist({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (p) => 0.52 * hazeAmount(p))

  return (
    <motion.g style={{ opacity }}>
      {FOREGROUND_MIST.map((band, i) => (
        <ellipse
          key={i}
          className="scene-ground-mist"
          cx={band.cx}
          cy={band.cy}
          rx={band.rx}
          ry={band.ry}
          fill="url(#scene-fog-grad)"
          opacity={band.opacity}
          style={{ animationDelay: `${-i * 5}s` }}
        />
      ))}
    </motion.g>
  )
}

interface GroundEffectsProps {
  theme: SceneThemeId
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  compact: boolean
}

export function GroundEffects({ theme, progress, mouseX, mouseY, compact }: GroundEffectsProps) {
  const fx = SCENE_EFFECTS[theme]
  const reduced = useReducedMotion()
  const count = compact ? Math.min(fx.fireflies, 8) : fx.fireflies

  return (
    <g className="scene-ground-effects" aria-hidden="true">
      <ForegroundMist progress={progress} />
      <AnimatePresence initial={false}>
        <motion.g
          key={`ground-${theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {fx.mist && <GroundMist progress={progress} />}
          {count > 0 &&
            (reduced ? (
              <StaticFireflies count={count} />
            ) : (
              <Fireflies count={count} mouseX={mouseX} mouseY={mouseY} progress={progress} />
            ))}
        </motion.g>
      </AnimatePresence>
    </g>
  )
}
