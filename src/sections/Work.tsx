import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'
import { riseInView } from '../lib/motion'
import { ArrowUpRightIcon } from '../components/Icons'
import { projects } from '../data/profile'

const SPANS = ['span-7', 'span-5', 'span-4', 'span-4', 'span-4', 'span-12']

export default function Work() {
  const reduced = useReducedMotion()

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <SectionHeading
          num="01"
          title={
            <span id="work-title">
              Selected <span className="dim">fixtures</span>
            </span>
          }
          lede="Two builds treated like a fixture list: who played, what the match was, and how it ended."
        />

        <div className="work-grid">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              className={`project-card ${SPANS[index] ?? 'span-4'}`}
              {...riseInView(reduced, { y: 24, delay: (index % 3) * 0.08 })}
            >
              <div className="project-media">
                <img
                  src={project.image}
                  alt={`Interface screenshot of ${project.name}`}
                  loading="lazy"
                  width={1200}
                  height={750}
                />
                <div className="project-reveal">
                  <ul className="project-stack">
                    {project.stack.map((tech) => (
                      <li key={tech} className="glass-pill">{tech}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <a key={link.label} href={link.url}>
                        {link.label} <ArrowUpRightIcon />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="project-fixture">
                <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="project-category">{project.category}</span>
                <span className="project-tag">{project.tag}</span>
              </div>

              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc glass-text">{project.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
