import { useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Stat } from '../data/profile'

function Digit({ value, delay }: { value: number; delay: number }) {
  return (
    <span className="odo-digit" aria-hidden="true">
      <span className="odo-reel" style={{ transform: `translateY(${-value * 10}%)`, transitionDelay: `${delay}ms` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </span>
    </span>
  )
}

function OdometerValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const digits = String(value).split('').map(Number)
  const shown = inView ? digits : digits.map(() => 0)

  return (
    <span className="odo" ref={ref} aria-hidden="true">
      {shown.map((digit, index) => (
        <Digit key={index} value={digit} delay={(shown.length - 1 - index) * 70} />
      ))}
    </span>
  )
}

export default function Odometer({ stat }: { stat: Stat }) {
  return (
    <div className="stat">
      <p className="stat-value">
        <OdometerValue value={stat.value} />
        <span className="stat-suffix">{stat.suffix}</span>
        <span className="sr-only">{stat.value}</span>
      </p>
      <p className="stat-label">{stat.label}</p>
    </div>
  )
}
