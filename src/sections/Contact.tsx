import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRightIcon, CheckIcon, CopyIcon, DownloadIcon } from '../components/Icons'
import { riseInView } from '../lib/motion'
import { useCopyToClipboard } from '../lib/hooks'
import { profile } from '../data/profile'

export default function Contact() {
  const reduced = useReducedMotion()
  const { copy, status } = useCopyToClipboard()

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <motion.h2 className="contact-title glass-text" id="contact-title" {...riseInView(reduced, { y: 16 })}>
          <span>Let&apos;s build</span>
          <span className="outline">kick off a project</span>
        </motion.h2>

        <motion.div className="contact-actions" {...riseInView(reduced, { y: 18, delay: 0.1 })}>
          <button
            className="contact-action contact-action-email glass-text"
            type="button"
            onClick={() => copy(profile.email)}
            aria-label={`Copy email address ${profile.email}`}
          >
            {profile.email}
            {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
          </button>
          <a
            className="contact-action contact-action-resume glass-text"
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            Resume
            <DownloadIcon />
          </a>
          <span className="contact-action-status" role="status" aria-live="polite">
            {status === 'copied'
              ? 'Copied!'
              : status === 'error'
                ? 'Copy failed — select the address manually'
                : ''}
          </span>
        </motion.div>

        <motion.div className="contact-grid glass-text" {...riseInView(reduced, { delay: 0.18 })}>
          <div className="contact-block">
            <h3 className="contact-label">Elsewhere</h3>
            <ul className="contact-socials">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.url} target="_blank" rel="noreferrer">
                    {social.label} <ArrowUpRightIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-block">
            <h3 className="contact-label">Availability</h3>
            <p className="contact-text">{profile.availability} — freelance and full-time roles.</p>
          </div>

          <div className="contact-block">
            <h3 className="contact-label">Based in</h3>
            <p className="contact-text">
              {profile.location}
              <br />
              {profile.timezone}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
