import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { fireStrength } from './cameraConfig'
import { fireToForeground } from './nightCampConfig'
import { useSceneTheme } from './scene-theme-context'

interface FirelightProps {
  progress: MotionValue<number>
  compact: boolean
  /** id of the clipPath that confines the light to foreground silhouettes. */
  clipId: string
}

/**
 * Night-only firelight. The radial pools are clipped to the foreground art
 * (near trees + ground) by `clipId`, so they warm the woods around the camp
 * without ever tinting the mountains or sky behind it. Ignition is scrubbed
 * with the same final-scroll window as the flames.
 */
export default function Firelight({ progress, compact, clipId }: FirelightProps) {
  const { sceneTheme } = useSceneTheme()
  const reduced = useReducedMotion()
  const fullyLit = useMotionValue(1)

  const ignite = useTransform(progress, fireStrength)
  const light = reduced ? fullyLit : ignite

  // Follows NIGHT_SPOT via the same placement math used by Camp.
  const { x: fx, y: fy } = fireToForeground(compact)

  if (sceneTheme !== 'night') return null

  return (
    <motion.g
      className="scene-firelight"
      style={{ opacity: light }}
      clipPath={`url(#${clipId})`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="scene-firelight-grad">
          <stop offset="0%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.5 }} />
          <stop offset="38%" style={{ stopColor: 'var(--fire)', stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: 'var(--fire)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <g className="scene-firelight-pulse">
        {/* Broad wash across the nearby trees and forest floor. */}
        <ellipse cx={fx} cy={fy - 8} rx={540} ry={320} fill="url(#scene-firelight-grad)" />
        {/* Tighter, brighter pool right around the fire. */}
        <ellipse cx={fx} cy={fy - 2} rx={220} ry={130} fill="url(#scene-firelight-grad)" />
      </g>
    </motion.g>
  )
}
