import type { MotionValue } from 'framer-motion'
import type { SceneThemeId } from './sceneTheme'
import { CampTent } from './CampScenery'
import Campfire from './Campfire'

interface CampPropsProps {
  theme: SceneThemeId
  /** 0→1 bonfire / interior glow ignition over the last stretch of scroll. */
  ignite: MotionValue<number>
}

/** Night: tent (tent.svg) + a real wood-fired campfire. */
function NightProps({ ignite }: { ignite: MotionValue<number> }) {
  return (
    <g aria-hidden="true">
      <CampTent />
      <Campfire ignite={ignite} />
    </g>
  )
}

/** Noon: helmet and bottle on the ground (the shade tree is always mounted). */
function NoonProps() {
  return (
    <g aria-hidden="true">
      {/* Helmet */}
      <path d="M-16 148 a11 11 0 0 1 22 0 Z" fill="var(--camp-ink)" />
      <rect x={-6} y={144} width={14} height={4} rx={2} fill="var(--camp-accent)" />
      {/* Water bottle */}
      <rect x={16} y={130} width={9} height={18} rx={3} fill="var(--camp-accent)" />
    </g>
  )
}

/** Evening: tent (tent.svg) + long warm shadows cast across the ground. */
function SunsetProps() {
  return (
    <g aria-hidden="true">
      <CampTent />
      <g className="scene-long-shadows">
        <ellipse cx={150} cy={150} rx={150} ry={6} fill="var(--camp-ink)" opacity={0.22} />
        <ellipse cx={300} cy={150} rx={70} ry={5} fill="var(--camp-ink)" opacity={0.22} />
      </g>
    </g>
  )
}

/** Morning: mist is an ambient effect; the mug rides with the rider. */
function MorningProps() {
  return null
}

export default function CampProps({ theme, ignite }: CampPropsProps) {
  if (theme === 'night') return <NightProps ignite={ignite} />
  if (theme === 'noon') return <NoonProps />
  if (theme === 'sunset') return <SunsetProps />
  return <MorningProps />
}
