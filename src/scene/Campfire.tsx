import { motion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { NIGHT_SPOT } from './nightCampConfig'

interface CampfireProps {
  /** 0→1 ignition over the final scroll stretch. */
  ignite: MotionValue<number>
}

/**
 * Night bonfire drawn in camp-local coords (ground line y=148), around (0,0).
 * NIGHT_SPOT is the same transform used by the rider, so the fire follows the
 * person. Only the fire's own opacity, flicker and embers are animated.
 */
export default function Campfire({ ignite }: CampfireProps) {
  return (
    <g
      className="scene-campfire"
      transform={`translate(${NIGHT_SPOT.x} ${NIGHT_SPOT.y})`}
      aria-hidden="true"
    >
      {/* Warm pool on the ground beneath the pit. */}
      <motion.g style={{ opacity: ignite }}>
        <ellipse
          className="scene-campfire-glow"
          cx={0}
          cy={140}
          rx={82}
          ry={24}
          fill="url(#scene-fire-glow-grad)"
        />
      </motion.g>

      {/* Stone ring. */}
      <g fill="var(--stone)" opacity={0.72}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2
          return (
            <ellipse
              key={`stone-${i}`}
              cx={Math.cos(a) * 32}
              cy={142 + Math.sin(a) * 8}
              rx={7}
              ry={3.8}
              transform={`rotate(${(a * 180) / Math.PI} ${(Math.cos(a) * 32).toFixed(1)} ${(142 + Math.sin(a) * 8).toFixed(1)})`}
            />
          )
        })}
      </g>

      {/* Ember-warmed crossed logs, with a glowing coal bed between them. */}
      <g fill="none" stroke="var(--fire-log)" strokeWidth={8} strokeLinecap="round">
        <path d="M-27 146 L27 132" />
        <path d="M-26 132 L28 146" />
        <path d="M0 149 L0 127" strokeWidth={6.5} />
      </g>
      <path
        d="M-20 140 Q-8 134 0 139 T20 137"
        fill="none"
        stroke="var(--fire)"
        strokeWidth={3.4}
        strokeLinecap="round"
        opacity={0.82}
      />

      {/* Layered, uneven tongues: orange outside, bright yellow at the heart. */}
      <motion.g style={{ opacity: ignite }}>
        <path
          className="scene-flame"
          d="M-17 141 C-26 127 -19 114 -11 104 C-13 118 -6 124 -4 133 Z"
          fill="var(--fire)"
          opacity={0.85}
          style={{ animationDuration: '0.48s' }}
        />
        <path
          className="scene-flame"
          d="M-6 142 C-15 126 -7 108 1 90 C8 107 15 125 7 142 Z"
          fill="var(--fire)"
        />
        <path
          className="scene-flame"
          d="M5 141 C3 127 11 115 17 107 C19 122 17 135 11 142 Z"
          fill="var(--fire)"
          opacity={0.9}
          style={{ animationDuration: '0.37s' }}
        />
        <path
          className="scene-flame-core"
          d="M-5 141 C-11 129 -4 116 1 103 C6 116 10 129 4 141 Z"
          fill="var(--fire-core)"
        />
        <path
          className="scene-flame-core"
          d="M-13 140 C-17 131 -12 123 -8 117 C-7 127 -3 132 -2 139 Z"
          fill="var(--fire-core)"
          opacity={0.85}
          style={{ animationDuration: '0.27s' }}
        />
        {Array.from({ length: 6 }, (_, i) => (
          <circle
            key={`ember-${i}`}
            className="scene-ember"
            cx={(i - 2.5) * 7}
            cy={126}
            r={1.7 + (i % 2) * 0.7}
            fill="var(--fire)"
            style={{
              animationDelay: `${i * 0.55}s`,
              animationDuration: `${2.2 + (i % 3) * 0.45}s`,
            }}
          />
        ))}
      </motion.g>
    </g>
  )
}
