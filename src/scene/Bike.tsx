import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import bikeRaw from './bike1.svg?raw'

interface BikeProps {
  /** 0→1, but only starts above p = HEADLIGHT_THRESHOLD. */
  headlight: MotionValue<number>
}

// bike1.svg is a 1056×594 raster (content ≈ x 182–903, y 58–537), front faces +x.
// Map it into camp local coords so the wheels sit on the ground line y=148.
const BIKE_SCALE = 0.235
const BIKE_X = -8
// The rear wheel sits higher in the photo (bottom ≈ y=527) than the front
// (≈ y=535). Pin the rear contact just under the ground line so neither wheel
// floats: the front sinks a little further and is hidden by the foreground fill.
const BIKE_SOURCE_BOTTOM = 527
const BIKE_Y = 150 - BIKE_SCALE * BIKE_SOURCE_BOTTOM

// Headlight centre in image coords → camp local (after the map above).
const HEADLIGHT_X = BIKE_X + BIKE_SCALE * 778
const HEADLIGHT_Y = BIKE_Y + BIKE_SCALE * 268

const bikeMarkup = bikeRaw.replace(/<\/?svg[^>]*>/g, '').trim()

/**
 * Adventure bike from bike1.svg — inlined so the embedded image renders in-scene.
 * Local coords: ground line y=148, front faces +x.
 */
export default function Bike({ headlight }: BikeProps) {
  return (
    <g className="scene-bike" aria-hidden="true">
      <g
        className="scene-bike-art"
        transform={`translate(${BIKE_X} ${BIKE_Y}) scale(${BIKE_SCALE})`}
        dangerouslySetInnerHTML={{ __html: bikeMarkup }}
      />
      <motion.circle
        className="scene-headlight"
        cx={HEADLIGHT_X}
        cy={HEADLIGHT_Y}
        r={7}
        fill="var(--camp-accent)"
        style={{ opacity: headlight }}
      />
    </g>
  )
}
