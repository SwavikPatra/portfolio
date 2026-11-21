import { useEffect, useMemo, useState } from 'react'
import { useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { CAMERA } from './cameraConfig'
import { LANDSCAPE } from './landscapeConfig'
import { generateLandscape } from './landscapeGenerate'
import type { GeneratedLandscape } from './landscapeGenerate'

/**
 * Page-wide scroll progress in [0, 1], scrubbed with ~1s smoothing so layer
 * movement is continuous (ScrollTrigger `scrub: 1` equivalent).
 *
 * prefers-reduced-motion: no scrubbing at all — pin to the final near state
 * (p = 1) so the camp is full size and fully coloured immediately.
 */
export function useScrollProgress(): MotionValue<number> {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scrubbed = useSpring(scrollYProgress, CAMERA.scrub)
  const finalState = useMotionValue(1)

  return reduced ? finalState : scrubbed
}

/**
 * Normalised pointer position in [-1, 1], lerped toward the real pointer
 * inside a single requestAnimationFrame loop (floaty, never jittery).
 * Disabled on touch devices and for prefers-reduced-motion.
 */
export function useMouseParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    if (reduced) return
    // pointer: coarse ≈ touch — spec says no mouse effect there.
    if (window.matchMedia('(pointer: coarse)').matches) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let frame = 0

    const onMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1
      targetY = (event.clientY / window.innerHeight) * 2 - 1
    }

    const tick = () => {
      // Lerp factor 0.07 → smooth settle in ~300ms, no overshoot.
      currentX += (targetX - currentX) * 0.07
      currentY += (targetY - currentY) * 0.07
      x.set(currentX)
      y.set(currentY)
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [reduced, x, y])

  return useMemo(() => ({ x, y }), [x, y])
}

/** True when the viewport is in the "mobile" range (fewer layers, lighter FX). */
export function useIsCompactViewport(): boolean {
  const [compact, setCompact] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setCompact(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return compact
}

/**
 * Generated ridge/tree geometry. Recomputes on seed/compact change and once
 * after a resize settles. Shared by Landscape and Foreground so the near
 * tree band uses the exact same ground curve as its fill.
 */
export function useLandscapeGeometry(seed: number, compact: boolean): GeneratedLandscape {
  const [viewportW, setViewportW] = useState(() =>
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  )

  useEffect(() => {
    let timer = 0
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setViewportW(window.innerWidth), 150)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
    }
  }, [])

  return useMemo(
    () => generateLandscape(seed, compact, LANDSCAPE),
    // viewportW in deps → one recompute after resize settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, compact, viewportW],
  )
}
