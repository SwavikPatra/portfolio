import { motion, useTransform } from 'framer-motion'
import { useState } from 'react'
import { useReadingMode } from '../theme/read-mode-context'
import { SceneThemeProvider } from './SceneThemeContext'
import { useSceneTheme } from './scene-theme-context'
import { SCENE_PALETTES, paletteToCssVars } from './sceneTheme'
import { hazeAmount } from './cameraConfig'
import { useIsCompactViewport, useMouseParallax, useScrollProgress } from './hooks'
import { LANDSCAPE } from './landscapeConfig'
import Sky from './Sky'
import Landscape from './Landscape'
import ValleyFog from './ValleyFog'
import Foreground from './Foreground'
import { GroundEffects, SkyEffects } from './Effects'
import ThemeToggle from './ThemeToggle'
import ContactMilestone from './ContactMilestone'
import type { CSSProperties } from 'react'
import type { MotionValue } from 'framer-motion'

interface Mouse {
  x: MotionValue<number>
  y: MotionValue<number>
}

function SceneArt({
  seed,
  progress,
  mouse,
}: {
  seed: number
  progress: MotionValue<number>
  mouse: Mouse
}) {
  const { sceneTheme } = useSceneTheme()
  const compact = useIsCompactViewport()

  return (
    <div className="scene-art" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="scene-sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--sky-top)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--sky-bottom)' }} />
          </linearGradient>
          <radialGradient id="scene-sun-glow-grad">
            <stop offset="0%" style={{ stopColor: 'var(--sun-glow)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--sun-glow)', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="scene-mist-grad">
            <stop offset="0%" style={{ stopColor: 'var(--mist)' }} />
            <stop offset="55%" style={{ stopColor: 'var(--mist)', stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: 'var(--mist)', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="scene-fog-grad" className="scene-fog-grad">
            <stop offset="0%" style={{ stopColor: 'var(--haze)' }} />
            <stop offset="55%" style={{ stopColor: 'var(--haze)', stopOpacity: 0.65 }} />
            <stop offset="100%" style={{ stopColor: 'var(--haze)', stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="scene-fire-glow-grad">
            <stop offset="0%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
          </radialGradient>
          {/* Warm air behind the night rider: he reads as a dark shape against
              it, while the fire's own ground pool keeps its softer gradient. */}
          <radialGradient id="scene-camp-air-glow-grad">
            <stop offset="0%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.55 }} />
            <stop offset="45%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.24 }} />
            <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
          </radialGradient>
          {/* Rim only on the fire-facing side: the stroke fades out across the
              rider's width in his source coordinate space. */}
          <linearGradient
            id="scene-rider-rim-grad"
            gradientUnits="userSpaceOnUse"
            x1="140"
            y1="0"
            x2="460"
            y2="0"
          >
            <stop offset="0%" style={{ stopColor: 'var(--fire)', stopOpacity: 1 }} />
            <stop offset="35%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
          </linearGradient>
          <radialGradient id="scene-fly-grad">
            <stop offset="0%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.95 }} />
            <stop offset="40%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
          </radialGradient>
          {/* Fades along a tapered trail polygon (a plain horizontal line has a
              zero-height bbox, so an objectBoundingBox gradient won't paint). */}
          <linearGradient id="scene-meteor-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: 'var(--star)', stopOpacity: 0 }} />
            <stop offset="65%" style={{ stopColor: 'var(--star)', stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: 'var(--star)', stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>

        <Sky theme={sceneTheme} />
        <SkyEffects theme={sceneTheme} />

        <Landscape
          progress={progress}
          mouseX={mouse.x}
          mouseY={mouse.y}
          compact={compact}
          seed={seed}
        />

        {/* Fog veils the background but sits behind the foreground plane, so
            the dark green ground reads as being well in front of the valley. */}
        <ValleyFog progress={progress} mouseX={mouse.x} mouseY={mouse.y} />

        {/* Near trees + camp + ground share one vertical scroll drift. */}
        <Foreground
          progress={progress}
          mouseX={mouse.x}
          mouseY={mouse.y}
          compact={compact}
          seed={seed}
        />

        <GroundEffects
          theme={sceneTheme}
          progress={progress}
          mouseX={mouse.x}
          mouseY={mouse.y}
          compact={compact}
        />
      </svg>
    </div>
  )
}

/**
 * Fixed full-screen background stage. Art is aria-hidden (decorative);
 * interactive pieces (toggle, milestone) render as
 * siblings with their own z-index so they are not trapped under the
 * scene's stacking context.
 *
 * --haze-p is the ONLY thing written from scroll on the scene root: CSS uses
 * it inside color-mix() so far layers tint toward --haze at p=0 and reach
 * their true palette colour at p=1 (colours animate, never the reveal art).
 */
function SceneStage() {
  const { sceneTheme } = useSceneTheme()
  const vars = paletteToCssVars(SCENE_PALETTES[sceneTheme]) as CSSProperties
  const [seed, setSeed] = useState(LANDSCAPE.seed)
  const { readingOn } = useReadingMode()
  const frozen = readingOn
  const progress = useScrollProgress(frozen)
  const mouse = useMouseParallax(frozen)
  const hazeP = useTransform(progress, (p) => `${(hazeAmount(p) * 100).toFixed(2)}%`)

  return (
    <>
      <motion.div
        className="scene"
        data-scene={sceneTheme}
        style={{ ...vars, '--haze-p': hazeP } as unknown as CSSProperties}
      >
        <SceneArt seed={seed} progress={progress} mouse={mouse} />
      </motion.div>
      {/* Soft veil so page text stays readable over the scene (z −1). */}
      <div className="scene-veil" aria-hidden="true" />
      <ThemeToggle onRandomize={() => setSeed(Math.floor(Math.random() * 999999))} />
      <ContactMilestone progress={progress} mouse={mouse} />
    </>
  )
}

export default function SceneBackground() {
  return (
    <SceneThemeProvider>
      <SceneStage />
    </SceneThemeProvider>
  )
}
