import { useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { DEPTH, hazeAmount } from './cameraConfig'
import DepthLayer from './DepthLayer'

interface FogBandConfig {
  cx: number
  cy: number
  rx: number
  ry: number
  depth: number
  /** Opacity kept at the bottom of the page (p=1). */
  base: number
  /** Extra opacity from the fog that gathers on the upper side (p=0). */
  haze: number
}

// Soft haze banks: two high ones read as fog over the far peaks when the
// camera is up, the low one keeps a permanent gap between the green foreground
// ground and the darker valley/trees behind it.
const FOG_BANDS: FogBandConfig[] = [
  { cx: 430, cy: 340, rx: 900, ry: 58, depth: DEPTH.ridgeFar, base: 0, haze: 0.5 },
  { cx: 1060, cy: 470, rx: 940, ry: 54, depth: DEPTH.ridgeMid, base: 0, haze: 0.42 },
  { cx: 720, cy: 775, rx: 1140, ry: 42, depth: DEPTH.treeMid, base: 0.28, haze: 0.4 },
]

interface ValleyFogProps {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export default function ValleyFog({ progress, mouseX, mouseY }: ValleyFogProps) {
  return (
    <g className="scene-valley-fog" aria-hidden="true">
      {FOG_BANDS.map((band, i) => (
        <FogBand
          key={i}
          band={band}
          progress={progress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </g>
  )
}

function FogBand({
  band,
  progress,
  mouseX,
  mouseY,
}: {
  band: FogBandConfig
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const opacity = useTransform(
    progress,
    (p) => band.base + band.haze * hazeAmount(p),
  )

  return (
    <DepthLayer
      progress={progress}
      mouseX={mouseX}
      mouseY={mouseY}
      depth={band.depth}
      opacity={opacity}
    >
      <ellipse cx={band.cx} cy={band.cy} rx={band.rx} ry={band.ry} fill="url(#scene-fog-grad)" />
    </DepthLayer>
  )
}
