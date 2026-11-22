import type { CSSProperties } from 'react'
import type { SceneThemeId } from './sceneTheme'

// Both bodies ride the same elliptical arc across the sky: left horizon →
// crown → right horizon. The value is a percentage of that arc (0 = far left,
// 100 = far right); CSS maps it to x/y with sin/cos and transitions the single
// number, so a theme switch glides along the curve instead of cutting across.
const SUN_ARC: Record<SceneThemeId, number> = {
  morning: 26,
  noon: 50,
  sunset: 74,
  night: 100, // sets behind the right-hand ridge
}

const MOON_ARC: Record<SceneThemeId, number> = {
  morning: 0,
  noon: 0,
  sunset: 0,
  night: 26, // rises from the left horizon
}

export default function Sky({ theme }: { theme: SceneThemeId }) {
  const isNight = theme === 'night'

  return (
    <g className="scene-sky">
      <rect className="scene-sky-rect" x={0} y={0} width={1440} height={900} />
      <g
        className="scene-sun"
        style={{ '--sun-t': SUN_ARC[theme], opacity: isNight ? 0 : 1 } as CSSProperties}
      >
        <circle className="scene-sun-glow" r={132} />
        <circle className="scene-sun-disc" r={44} />
      </g>
      <g
        className="scene-moon"
        style={{ '--moon-t': MOON_ARC[theme], opacity: isNight ? 1 : 0 } as CSSProperties}
      >
        <circle className="scene-moon-glow" r={116} />
        <circle className="scene-moon-disc" r={38} />
        <circle className="scene-moon-crater" cx={-12} cy={-6} r={7} />
        <circle className="scene-moon-crater" cx={11} cy={12} r={5} />
        <circle className="scene-moon-crater" cx={15} cy={-11} r={3.5} />
      </g>
    </g>
  )
}
