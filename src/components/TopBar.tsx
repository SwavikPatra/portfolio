import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/profile'
import { useScrolled, useScrollSpy } from '../lib/hooks'
import { CloseIcon, DownloadIcon, MenuIcon, OpenBookIcon } from './Icons'
import { useReadingMode } from '../theme/read-mode-context'

const SECTION_IDS = ['top', 'work', 'about', 'experience', 'contact']

export default function TopBar() {
  const { readingOn, toggleReading } = useReadingMode()
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
        <a className="monogram" href="#top" aria-label="Swavik Patra — back to top">
          <span>Swavik</span>
        </a>

        <nav className="topnav" aria-label="Primary">
          {profile.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href.slice(1) ? 'true' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="topbar-actions">
          <a
            className="btn btn-ghost btn-resume-top"
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            Resume <DownloadIcon />
          </a>
          <a className="btn btn-primary btn-cta" href="#contact">
            Let&apos;s talk
          </a>
          <button
            className={`icon-btn reading-toggle${readingOn ? ' is-active' : ''}`}
            onClick={toggleReading}
            aria-label="Reading mode"
            aria-pressed={readingOn}
            data-tooltip={readingOn ? 'Reading mode on' : 'Reading mode off'}
            title="Reading mode"
          >
            <OpenBookIcon />
          </button>
          <button
            className="icon-btn menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="scrim" onClick={() => setMenuOpen(false)} />
            <motion.aside
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="mobile-menu-head">
                <span>Menu</span>
                <button
                  className="icon-btn"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  autoFocus
                >
                  <CloseIcon />
                </button>
              </div>

              <nav aria-label="Mobile">
                {profile.nav.map((item, index) => (
                  <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="mobile-menu-foot">
                <a
                  className="btn btn-primary"
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  style={{ marginBottom: 10 }}
                >
                  Let&apos;s talk
                </a>
                <a
                  className="btn btn-ghost"
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  style={{ marginBottom: 18 }}
                >
                  Resume <DownloadIcon />
                </a>
                <p>
                  {profile.email}
                  <br />
                  {profile.location} · {profile.timezone}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
