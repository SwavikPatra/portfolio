import DepthLayer from './DepthLayer'
import type { MotionValue } from 'framer-motion'

interface MountainLayerProps {
  /** Scroll progress 0→1 (scrubbed). */
  progress: MotionValue<number>
  /** Normalised mouse position −1→1 (already lerped + disabled on touch). */
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  /** Depth of this ridge: y = -depth * RANGE * p. */
  depth: number
  fillVar: string
  /** Closed path, bottom-anchored in the viewBox. */
  d: string
  /** Optional class hook (e.g. ground plane). */
  className?: string
}

/** One parallax ridge. Depth alone decides how far it slides vertically. */
export default function MountainLayer({
  progress,
  mouseX,
  mouseY,
  depth,
  fillVar,
  d,
  className,
}: MountainLayerProps) {
  return (
    <DepthLayer
      progress={progress}
      mouseX={mouseX}
      mouseY={mouseY}
      depth={depth}
      fill={fillVar}
      className={className ? `scene-layer ${className}` : 'scene-layer'}
    >
      <path d={d} />
    </DepthLayer>
  )
}
