import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'
import { layerY, mousePx } from './cameraConfig'

interface DepthLayerProps {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  /** 0 = sky … 1 = ground + camp. Drives how far the plane slides vertically. */
  depth: number
  className?: string
  fill?: string
  color?: string
  opacity?: MotionValue<number>
  children: ReactNode
}

/**
 * One parallax plane, two nested transforms:
 *   outer <g> = pointer drift (5–20px, lerped in hooks.ts)
 *   inner <g> = vertical scroll drift: y = -depth * RANGE * p
 * Keeping them separate means pointer movement never disturbs the scroll drift.
 */
export default function DepthLayer({
  progress,
  mouseX,
  mouseY,
  depth,
  className,
  fill,
  color,
  opacity,
  children,
}: DepthLayerProps) {
  const y = useTransform(progress, (p) => layerY(depth, p))
  const xMouse = useTransform(mouseX, (v) => v * mousePx(depth))
  const yMouse = useTransform(mouseY, (v) => v * mousePx(depth) * 0.5)

  return (
    <motion.g
      className="scene-depth-outer"
      style={{ x: xMouse, y: yMouse, ...(opacity ? { opacity } : {}) }}
    >
      <motion.g
        className={className ? `scene-depth-inner ${className}` : 'scene-depth-inner'}
        style={{ y }}
        fill={fill}
        color={color}
      >
        {children}
      </motion.g>
    </motion.g>
  )
}
