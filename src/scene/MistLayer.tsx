import { useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { DEPTH, hazeAmount } from './cameraConfig'
import type { MistBandConfig } from './landscapeConfig'
import DepthLayer from './DepthLayer'

interface MistLayerProps {
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  bands: MistBandConfig[]
}

/**
 * Horizontal mist bands between depth ranges — soft radial ellipses,
 * no SVG blur filter (cheap to translate). They are the ONLY thing in the
 * scene whose opacity changes: the bands thin out as the camera descends.
 */
export default function MistLayer({ progress, mouseX, mouseY, bands }: MistLayerProps) {
  const opacity = useTransform(progress, (p) => 1 - hazeAmount(p) * 0.8)

  return (
    <g className="scene-mist" aria-hidden="true">
      {bands.map((band, i) => (
        <MistBand
          key={`${band.cx}-${band.cy}-${i}`}
          band={band}
          progress={progress}
          mouseX={mouseX}
          mouseY={mouseY}
          opacity={opacity}
          index={i}
        />
      ))}
    </g>
  )
}

function MistBand({
  band,
  progress,
  mouseX,
  mouseY,
  opacity,
  index,
}: {
  band: MistBandConfig
  progress: MotionValue<number>
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  opacity: MotionValue<number>
  index: number
}) {
  const depth = DEPTH.mist[Math.min(index, DEPTH.mist.length - 1)]

  return (
    <DepthLayer
      progress={progress}
      mouseX={mouseX}
      mouseY={mouseY}
      depth={depth}
      opacity={opacity}
    >
      <ellipse cx={band.cx} cy={band.cy} rx={band.rx} ry={band.ry} fill="url(#scene-mist-grad)" />
    </DepthLayer>
  )
}
