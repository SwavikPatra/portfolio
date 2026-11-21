import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'
import { riseInView } from '../lib/motion'
import { education, roles } from '../data/profile'

export default function Experience() {
  const reduced = useReducedMotion()

  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <SectionHeading
          num="04"
          title={
            <span id="experience-title">
              The road <span className="dim">so far</span>
            </span>
          }
          lede="Stops along the way, newest first — plan less, keep moving."
        />

        <ol className="road">
          {roles.map((role, index) => (
            <motion.li
              className="road-stop"
              key={role.id}
              {...riseInView(reduced, { y: 22, delay: index * 0.05, margin: '-70px' })}
            >
              <span className="road-marker" aria-hidden="true">
                <span className="road-dot" />
              </span>

              <div className="road-content glass-text">
                <p className="road-period">{role.period}</p>
                <h3 className="road-title">{role.title}</h3>
                <p className="road-org">
                  {role.company}
                  <span aria-hidden="true"> · </span>
                  {role.location}
                </p>
                <p className="road-summary">{role.summary}</p>
                <ul className="road-bullets">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <ul className="road-stack">
                  {role.stack.map((tech) => (
                    <li key={tech} className="glass-pill">{tech}</li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="education glass-text">
          <h3 className="education-title">Education</h3>
          <ul className="education-list">
            {education.map((item) => (
              <li key={item.id}>
                <span className="education-date">{item.date}</span>
                <span className="education-name">{item.title}</span>
                <span className="education-org">{item.org}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
