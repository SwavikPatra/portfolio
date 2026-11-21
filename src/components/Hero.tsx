import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon } from './Icons'
import { profile } from '../data/profile'
import { riseOnMount } from '../lib/motion'

function AvailabilityBadge() {
  return (
    <div className="hero-badge">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path
            id="badge-circle"
            d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0"
            fill="none"
          />
        </defs>
        <circle cx="50" cy="50" r="22" fill="none" stroke="var(--border-strong)" strokeWidth={1} />
        <text xmlSpace="preserve">
          <textPath
            href="#badge-circle"
            startOffset="0%"
            textLength={226.23}
            lengthAdjust="spacing"
          >
            Available for work • Available for work •&#160;
          </textPath>
        </text>
      </svg>
      <a className="hero-badge-core" href="#contact" aria-label="Go to contact section">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12h14" strokeLinecap="round" />
          <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <span className="sr-only">{profile.availability}</span>
    </div>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="shell hero-inner">
        <div className="hero-copy glass-text">
          <motion.p className="hero-eyebrow" {...riseOnMount(reduced, 0.05)}>
            {profile.location} — {profile.timezone}
          </motion.p>

          <motion.h1 className="hero-title" {...riseOnMount(reduced, 0.12)}>
            <span>Software</span>
            <span className="dim">that still</span>
            <span className="outline">runs fast</span>
          </motion.h1>

          <motion.p className="hero-sub" {...riseOnMount(reduced, 0.2)}>
            I&apos;m Swavik — a backend engineer building Go and Python services,
            REST APIs and real-time systems that stay fast under load. When the
            laptop shuts, the side project comes out.
          </motion.p>

          <motion.div className="hero-actions" {...riseOnMount(reduced, 0.28)}>
            <a className="btn btn-primary" href="#work">
              See the work <ArrowRightIcon />
            </a>
            <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </motion.div>

          <motion.dl className="hero-meta" {...riseOnMount(reduced, 0.36)}>
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Backend — Go &amp; Python</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{profile.availability}</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          className="hero-stage"
          initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-circle" aria-hidden="true" />
          <div className="hero-photo-mask">
            <img
              className="hero-photo"
              src={profile.portrait}
              alt={`Cut-out portrait of ${profile.fullName}`}
              width={600}
              height={760}
              fetchPriority="high"
            />
          </div>
          <AvailabilityBadge />
          <p className="hero-name">
            Swavik
            <br />
            <em>Patra</em>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
