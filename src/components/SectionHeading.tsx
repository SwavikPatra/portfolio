import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { riseInView } from '../lib/motion'

interface SectionHeadingProps {
  num: string
  title: ReactNode
  lede?: string
}

export default function SectionHeading({ num, title, lede }: SectionHeadingProps) {
  const reduced = useReducedMotion()

  return (
    <motion.header className="section-head glass-text" {...riseInView(reduced, { y: 18 })}>
      <div className="section-title-row">
        <span className="section-num">{num}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {lede && <p className="section-lede">{lede}</p>}
    </motion.header>
  )
}
