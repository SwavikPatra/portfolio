import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'
import { riseInView } from '../lib/motion'
import { skillGroups } from '../data/profile'

export default function Skills() {
  const reduced = useReducedMotion()

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHeading
          num="03"
          title={
            <span id="skills-title">
              The stack I <span className="dim">reach for</span>
            </span>
          }
          lede="Languages, services, data and the practices that keep them maintainable."
        />

        <div className="skill-grid">
          {skillGroups.map((group, index) => (
            <motion.article
              key={group.id}
              className="skill-card"
              {...riseInView(reduced, { y: 20, delay: (index % 3) * 0.07, margin: '-60px' })}
            >
              <div className="skill-card-head">
                <h3 className="skill-card-title">{group.title}</h3>
                <p className="skill-card-summary">{group.summary}</p>
              </div>
              <ul className="skill-list">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="skill-pill glass-pill">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
