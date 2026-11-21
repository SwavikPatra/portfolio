import { motion, useReducedMotion } from 'framer-motion'
import Odometer from '../components/Odometer'
import SectionHeading from '../components/SectionHeading'
import { riseInView } from '../lib/motion'
import { about, stats } from '../data/profile'

export default function About() {
  const reduced = useReducedMotion()

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <SectionHeading
          num="02"
          title={
            <span id="about-title">
              The person <span className="dim">behind the commits</span>
            </span>
          }
        />

        <div className="about-grid">
          <motion.div
            className="about-copy glass-text"
            {...riseInView(reduced)}
          >
            <p className="about-lead">{about.lead}</p>
            {about.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <p className="about-interests">
              Off the clock: {about.interests.join(' · ')}.
            </p>
          </motion.div>

          <motion.dl
            className="about-facts glass-text"
            {...riseInView(reduced, { delay: 0.1 })}
          >
            {about.facts.map((fact) => (
              <div key={fact.key}>
                <dt>{fact.key}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="stats-row">
          {stats.map((stat) => (
            <Odometer key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
