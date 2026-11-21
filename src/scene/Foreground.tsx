import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { DEPTH, layerY, mousePx } from './cameraConfig'
import { LANDSCAPE } from './landscapeConfig'
import { useLandscapeGeometry } from './hooks'
import Camp from './Camp'
import ForegroundGround from './ForegroundGround'
import { foregroundGroundPath } from './foregroundGroundGeometry'
import Firelight from './Firelight'

interface ForegroundProps {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  compact: boolean
  seed?: number
}

/**
 * The foreground is one plane: camp + ground fill share the same vertical
 * scroll drift, so the wheels never leave the ground line.
 * Pointer drift lives on an outer wrapper, separate from the scroll transform.
 */
export default function Foreground({
  progress,
  mouseX,
  mouseY,
  compact,
  seed = LANDSCAPE.seed,
}: ForegroundProps) {
  const geom = useLandscapeGeometry(seed, compact)

  const y = useTransform(progress, (p) => layerY(DEPTH.camp, p))
  const xMouse = useTransform(mouseX, (v) => v * mousePx(DEPTH.camp))
  const yMouse = useTransform(mouseY, (v) => v * mousePx(DEPTH.camp) * 0.5)

  return (
    <motion.g className="scene-foreground-outer" style={{ x: xMouse, y: yMouse }} aria-hidden="true">
      <motion.g className="scene-foreground" style={{ y }}>
        {/* Clip the night firelight to the exact foreground silhouettes so it
            warms only the ground — never the distant ranges. */}
        <defs>
          <clipPath id="scene-foreground-clip" clipPathUnits="userSpaceOnUse">
            <path d={geom.trees.near.ground} />
            <path d={foregroundGroundPath(compact)} />
          </clipPath>
        </defs>

        <path
          d={geom.trees.near.ground}
          fill="var(--trees-near)"
          className="scene-tree-ground"
        />

        <Camp progress={progress} compact={compact} />
        <ForegroundGround compact={compact} />
        <Firelight progress={progress} compact={compact} clipId="scene-foreground-clip" />
      </motion.g>
    </motion.g>
  )
}
