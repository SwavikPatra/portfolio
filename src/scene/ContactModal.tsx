import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CONTACT_CONFIG } from './contactConfig'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(0)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard API unavailable — nothing else we can do without a backend.
      return
    }
    setCopied(true)
    timerRef.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button type="button" className="scene-copy-btn" onClick={copy} aria-label={`Copy ${label}`}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <li className="scene-modal-row">
      <span className="scene-modal-key">{label}</span>
      <span className="scene-modal-actions">{children}</span>
    </li>
  )
}

/**
 * Contact card modal: resume + email/phone (with copy) + socials.
 * Focus trap, Esc to close, aria-modal, restores focus to the opener.
 */
export default function ContactModal({ open, onClose }: ContactModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => !node.hasAttribute('disabled'))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else if (active === last || !panelRef.current.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(focusTimer)
      opener?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="scene-modal"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <div
        className="scene-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scene-modal-title"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="scene-modal-head">
          <h2 className="scene-modal-title" id="scene-modal-title">
            Let&apos;s connect
          </h2>
          <button
            type="button"
            className="scene-modal-close"
            onClick={onClose}
            aria-label="Close contact details"
            ref={closeRef}
          >
            ✕
          </button>
        </div>

        <ul className="scene-modal-list">
          <Row label="Resume">
            <a className="scene-modal-link" href={CONTACT_CONFIG.resumeUrl} download>
              Download PDF
            </a>
          </Row>
          <Row label="Email">
            <a className="scene-modal-link" href={`mailto:${CONTACT_CONFIG.email}`}>
              {CONTACT_CONFIG.email}
            </a>
            <CopyButton value={CONTACT_CONFIG.email} label="email address" />
          </Row>
          <Row label="Phone">
            <a className="scene-modal-link" href={CONTACT_CONFIG.phoneHref}>
              {CONTACT_CONFIG.phone}
            </a>
            <CopyButton value={CONTACT_CONFIG.phone} label="phone number" />
          </Row>
          <Row label="Instagram">
            <a
              className="scene-modal-link"
              href={CONTACT_CONFIG.instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>
          </Row>
          <Row label="LinkedIn">
            <a
              className="scene-modal-link"
              href={CONTACT_CONFIG.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </Row>
          <Row label="GitHub">
            <a
              className="scene-modal-link"
              href={CONTACT_CONFIG.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </Row>
        </ul>
      </div>
    </div>
  )
}
