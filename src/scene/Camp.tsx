import { useCallback, useEffect, useRef } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { CAMERA, clamp01, easeInOut, fireStrength } from './cameraConfig'
import { CAMP_PLACEMENT } from './nightCampConfig'
import { useSceneTheme } from './scene-theme-context'
import Bike from './Bike'
import CampProps from './CampProps'
import { CampTrees, CampGlow } from './CampScenery'
import { EveningRider, MorningRider, NoonRider, NightRider } from './RiderPoses'

function campTransform(compact: boolean): string {
  const p = compact ? CAMP_PLACEMENT.compact : CAMP_PLACEMENT.desktop
  return `translate(${p.tx} ${p.ty}) scale(${p.scale})`
}

function RiderPose({
  theme,
  ignite,
}: {
  theme: ReturnType<typeof useSceneTheme>['sceneTheme']
  ignite: MotionValue<number>
}) {
  if (theme === 'morning') return <MorningRider />
  if (theme === 'noon') return <NoonRider />
  if (theme === 'sunset') return <EveningRider />
  return <NightRider ignite={ignite} />
}

interface CampSceneProps {
  progress: MotionValue<number>
  /** Mobile: shift + shrink the camp so it fits the portrait slice. */
  compact?: boolean
}

/**
 * The camp shares the foreground's vertical drift. The only extra motion is a
 * small scroll zoom: the subjects read slightly further away at the top and
 * ease to full size as the mist clears. It is applied to the SVG transform
 * attribute about the camp's ground line, so feet stay welded to the ground.
 * Only the final ignitions are progress-driven: bonfire, fire glow and the
 * headlight (which waits until p > HEADLIGHT_THRESHOLD).
 */
export default function Camp({ progress, compact = false }: CampSceneProps) {
  const { sceneTheme } = useSceneTheme()
  const reduced = useReducedMotion()
  const fullyLit = useMotionValue(1)

  const igniteScrubbed = useTransform(progress, fireStrength)
  const headlightScrubbed = useTransform(progress, (p) =>
    clamp01((p - CAMERA.HEADLIGHT_THRESHOLD) / (CAMERA.IGNITE_END - CAMERA.HEADLIGHT_THRESHOLD)),
  )

  const ignite = reduced ? fullyLit : igniteScrubbed
  const headlight = reduced ? fullyLit : headlightScrubbed

  const campRef = useRef<SVGGElement>(null)
  const placement = compact ? CAMP_PLACEMENT.compact : CAMP_PLACEMENT.desktop

  // 0.94 → 1: a few percent of "distance" at the top, gone by the bottom.
  const applyZoom = useCallback(
    (p: number) => {
      const z = reduced ? 1 : 0.94 + 0.06 * easeInOut(p)
      const ty = placement.ty + 148 * placement.scale * (1 - z)
      campRef.current?.setAttribute(
        'transform',
        `translate(${placement.tx} ${ty.toFixed(2)}) scale(${(placement.scale * z).toFixed(4)})`,
      )
    },
    [placement.tx, placement.ty, placement.scale, reduced],
  )

  useEffect(() => {
    applyZoom(progress.get())
  }, [progress, applyZoom])
  useMotionValueEvent(progress, 'change', applyZoom)

  return (
    <g ref={campRef} className="scene-camp" transform={campTransform(compact)}>
      <g className="scene-camp-inner">
        <CampGlow ignite={ignite} progress={progress} sceneTheme={sceneTheme} />
        <CampTrees />
        <Bike headlight={headlight} />
        {/* Pose + props swap together with a short crossfade. */}
        <AnimatePresence initial={false}>
          <motion.g
            key={sceneTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <RiderPose theme={sceneTheme} ignite={ignite} />
            <CampProps theme={sceneTheme} ignite={ignite} />
          </motion.g>
        </AnimatePresence>
      </g>
    </g>
  )
}
