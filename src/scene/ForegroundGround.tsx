import { mulberry32 } from './landscapeConfig'
import {
  COMPACT_GROUND_Y,
  GROUND_Y,
  X0,
  X1,
  foregroundGroundPath,
} from './foregroundGroundGeometry'

interface Stone {
  cx: number
  cy: number
  rx: number
  ry: number
  rotate: number
  opacity: number
}

interface Bush {
  cx: number
  cy: number
  rx: number
  ry: number
}

function scatter(top: number, seed: number) {
  const rand = mulberry32(seed)
  const stones: Stone[] = []
  const bushes: Bush[] = []

  for (let x = X0 + 24; x < X1; x += 72) {
    const cx = x + (rand() - 0.5) * 20
    const cy = top + 4 + rand() * 130
    const size = 1.8 + rand() * 3.2 + ((cy - top) / 130) * 2
    stones.push({
      cx,
      cy,
      rx: size,
      ry: size * (0.5 + rand() * 0.35),
      rotate: (rand() - 0.5) * 70,
      opacity: 0.45 + rand() * 0.5,
    })
  }

  for (let x = X0 + 70; x < X1; x += 210) {
    const cx = x + (rand() - 0.5) * 60
    // Keep the camp's footprint clear of large bushes.
    if (cx > 560 && cx < 1380) continue
    const h = 11 + rand() * 13
    bushes.push({
      cx,
      cy: top + 2 - h * 0.5 + (rand() - 0.5) * 5,
      rx: 20 + rand() * 24,
      ry: h,
    })
  }

  return { stones, bushes }
}

const DESKTOP = scatter(GROUND_Y, 20211)
const COMPACT = scatter(COMPACT_GROUND_Y, 48217)

/** Nearest ground plane: a green field with loose stones and low bushes. */
export default function ForegroundGround({ compact }: { compact: boolean }) {
  const { stones, bushes } = compact ? COMPACT : DESKTOP

  return (
    <g className="scene-foreground-ground" aria-hidden="true">
      <path d={foregroundGroundPath(compact)} fill="var(--grass)" />
      {stones.map((stone, i) => (
        <ellipse
          key={`stone-${i}`}
          cx={stone.cx}
          cy={stone.cy}
          rx={stone.rx}
          ry={stone.ry}
          transform={`rotate(${stone.rotate.toFixed(1)} ${stone.cx.toFixed(1)} ${stone.cy.toFixed(1)})`}
          fill="var(--stone)"
          opacity={stone.opacity}
        />
      ))}
      {bushes.map((bush, i) => (
        <g key={`bush-${i}`} fill="var(--bush)">
          <ellipse cx={bush.cx} cy={bush.cy} rx={bush.rx} ry={bush.ry} />
          <ellipse
            cx={bush.cx - bush.rx * 0.55}
            cy={bush.cy + bush.ry * 0.18}
            rx={bush.rx * 0.55}
            ry={bush.ry * 0.72}
          />
          <ellipse
            cx={bush.cx + bush.rx * 0.5}
            cy={bush.cy + bush.ry * 0.12}
            rx={bush.rx * 0.6}
            ry={bush.ry * 0.76}
          />
        </g>
      ))}
    </g>
  )
}
