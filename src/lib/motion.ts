import type { MotionProps } from 'framer-motion'

interface RiseOptions {
  y?: number
  delay?: number
  margin?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Scroll-reveal props. When the user prefers reduced motion, content is
 * visible immediately — nothing starts hidden.
 */
export function riseInView(reduced: boolean | null, options: RiseOptions = {}): MotionProps {
  if (reduced) return { initial: { opacity: 1, y: 0 } }

  return {
    initial: { opacity: 0, y: options.y ?? 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: options.margin ?? '-60px' },
    transition: { duration: 0.55, delay: options.delay ?? 0, ease: EASE },
  }
}

/** Same, but animates on mount instead of on scroll. */
export function riseOnMount(reduced: boolean | null, delay = 0): MotionProps {
  if (reduced) return { initial: { opacity: 1, y: 0 } }

  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  }
}
