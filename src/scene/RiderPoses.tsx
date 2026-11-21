// Traced rider silhouettes — one per time of day.
// Each source SVG has four grayscale layers: three silhouette tones plus a
// full-canvas white background. The background is dropped and all three tones
// are mapped onto currentColor, so the silhouette stays solid and high-contrast
// even under the scene's veil/mist instead of washing out into a grey negative.
import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { NIGHT_SPOT } from './nightCampConfig'
import morningRaw from './rider-morning.svg?raw'
import noonRaw from './rider-noon.svg?raw'
import eveningRaw from './rider-evening.svg?raw'
import nightRaw from './rider-night.svg?raw'

function riderMarkup(raw: string): string {
  return raw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/g, '')
    .replace(/<\/?svg[^>]*>/g, '')
    .replace(/<path\b[^>]*fill="rgb\(25\d,\s*25\d,\s*25\d\)"[^>]*\/>/g, '')
    .replace(/<\/?g[^>]*>/g, '')
    .replace(/fill="rgb\(\d+,\s*\d+,\s*\d+\)"/g, 'fill="currentColor"')
    .trim()
}

const morningMarkup = riderMarkup(morningRaw)
const noonMarkup = riderMarkup(noonRaw)
const eveningMarkup = riderMarkup(eveningRaw)
const nightMarkup = riderMarkup(nightRaw)

// The first subpath of the night trace's darkest layer is the rider + chair;
// the remaining subpaths are the baked firepit and tiny detail marks. Isolating
// it keeps the rim off the drawn flames.
function nightRiderOutline(raw: string): string {
  const path = raw.match(/<path\b[^>]*fill="rgb\(2,\s*2,\s*2\)"[^>]*>/)?.[0]
  const d = path?.match(/d="([^"]*)"/)?.[1]
  if (!d) return ''
  const next = d.indexOf('M ', 2)
  return next === -1 ? d : d.slice(0, next)
}

const nightOutline = nightRiderOutline(nightRaw)
const nightRimMarkup = nightOutline
  ? `<path d="${nightOutline}" fill="none" stroke="url(#scene-rider-rim-grad)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />`
  : ''

// Thin strokes over the traced chair — backrest, seat, upright and crossed
// legs — in --night-chair-ink so it reads as a separate, lighter object.
const nightChairMarkup = [
  'M414 176 C439 173 467 177 482 181 L478 284 L430 282 Z',
  'M477 214 L484 414',
  'M344 300 C390 294 432 294 472 298',
  'M350 302 L398 412',
  'M468 302 L330 402',
  'M322 412 L342 412',
  'M388 412 L408 412',
  'M476 414 L494 414',
]
  .map((d) => `<path d="${d}" />`)
  .join('')

// Small grow factor for the figures; the bike was shrunk slightly to match.
const RIDER_GROW = 1.06

// Transforms drop each trace's ink box onto the camp ground line (y=148) and
// centre the figure where the old flat-vector poses stood. Recomputing ty from
// the source bottom keeps the feet grounded after the grow factor.
function groundedTransform(tx: number, ty: number, scale: number): string {
  const next = scale * RIDER_GROW
  const sourceBottom = (148 - ty) / scale
  return `translate(${tx.toFixed(2)} ${(148 - next * sourceBottom).toFixed(2)}) scale(${next.toFixed(4)})`
}

const MORNING_TRANSFORM = groundedTransform(237, 24.8, 0.245)
// The seated poses are anchored on the camp-chair feet (~400 / ~412 in source
// space), not the rider's boot, so the chair sits on the ground. The boot ends
// up slightly below the line, where the foreground grass hides it.
const NOON_TRANSFORM = groundedTransform(-124, 56, 0.23)
const EVENING_TRANSFORM = groundedTransform(185.6, 28.7, 0.24)

// Night art includes its own firepit; align that fire with NIGHT_SPOT so it
// sits behind the animated flames rendered by Campfire. The y anchor is the
// chair feet, so the whole seated pose — chair included — meets the ground.
const NIGHT_SCALE = 0.26 * RIDER_GROW
const NIGHT_GROUND_Y = 412
const NIGHT_TRANSFORM = `translate(${(NIGHT_SPOT.x - NIGHT_SCALE * 105).toFixed(2)} ${(
  148 -
  NIGHT_SCALE * NIGHT_GROUND_Y
).toFixed(2)}) scale(${NIGHT_SCALE.toFixed(4)})`

function RiderArt({ markup, transform }: { markup: string; transform: string }) {
  return (
    <g className="scene-rider" transform={transform} style={{ color: '#070a0f' }} aria-hidden="true">
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </g>
  )
}

/** Morning: standing beside the bike, facing the sunrise. */
export function MorningRider() {
  return <RiderArt markup={morningMarkup} transform={MORNING_TRANSFORM} />
}

/** Noon: sitting in the camp chair in the shade. */
export function NoonRider() {
  return <RiderArt markup={noonMarkup} transform={NOON_TRANSFORM} />
}

/** Evening: standing with the camera, shooting the sunset. */
export function EveningRider() {
  return <RiderArt markup={eveningMarkup} transform={EVENING_TRANSFORM} />
}

/** Night: a cool indigo shape with a fire-side rim, lit air behind it. */
export function NightRider({ ignite }: { ignite: MotionValue<number> }) {
  return (
    <g
      className="scene-rider scene-rider--night"
      transform={NIGHT_TRANSFORM}
      style={{ color: 'var(--night-rider-ink)' }}
      aria-hidden="true"
    >
      {/* In front of the camp grove, behind the silhouette: the rider reads as
          a dark shape against the fire-lit air rather than against the woods. */}
      <motion.g className="scene-rider-airglow" style={{ opacity: ignite }}>
        <ellipse
          className="scene-rider-airglow-shape"
          cx={320}
          cy={235}
          rx={250}
          ry={230}
          fill="url(#scene-camp-air-glow-grad)"
        />
      </motion.g>
      <g dangerouslySetInnerHTML={{ __html: nightMarkup }} />
      <g
        className="scene-rider-chair"
        fill="none"
        stroke="var(--night-chair-ink)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: nightChairMarkup }}
      />
      <motion.g style={{ opacity: ignite }}>
        <g className="scene-rider-rim" dangerouslySetInnerHTML={{ __html: nightRimMarkup }} />
      </motion.g>
    </g>
  )
}
