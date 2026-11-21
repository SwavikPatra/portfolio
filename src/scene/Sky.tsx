import type { SceneThemeId } from './sceneTheme'

// Sun/moon anchor per theme (viewBox 1440×900). Moves with a 1s CSS
// transition when the time of day changes.
const SUN_POSITIONS: Record<SceneThemeId, { x: number; y: number }> = {
  morning: { x: 330, y: 300 },
  noon: { x: 720, y: 148 },
  sunset: { x: 1110, y: 330 },
  night: { x: 1145, y: 155 },
}

export default function Sky({ theme }: { theme: SceneThemeId }) {
  const sun = SUN_POSITIONS[theme]

  return (
    <g className="scene-sky">
      <rect className="scene-sky-rect" x={0} y={0} width={1440} height={900} />
      {/* Glow + disc share the sun anchor so both glide together on switch. */}
      <g className="scene-sun" style={{ transform: `translate(${sun.x}px, ${sun.y}px)` }}>
        <circle className="scene-sun-glow" r={132} />
        <circle className="scene-sun-disc" r={44} />
      </g>
    </g>
  )
}
