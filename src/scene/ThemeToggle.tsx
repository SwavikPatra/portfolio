import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactElement } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  READING_APPEARANCES,
  READING_TEMPERATURES,
  TEXT_SCALES,
  useReadingMode,
} from '../theme/read-mode-context'
import type { ReadingAppearance, ReadingTemperature } from '../theme/read-mode-context'
import { SCENE_THEMES } from './sceneTheme'
import type { SceneThemeId } from './sceneTheme'
import { useSceneTheme } from './scene-theme-context'

// Minimal line icons — one per time of day.
function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 14 4 4-4 4M18 2l4 4-4 4" />
      <path d="M2 18h3c.8 0 1.5-.4 1.9-1.1L11 8.1c.4-.7 1.1-1.1 1.9-1.1H22" />
      <path d="M2 6h3c.8 0 1.5.4 1.9 1.1l.6 1M17 18h5" />
    </svg>
  )
}

function SunriseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M12 3v3M5.6 7.6l2 2M18.4 7.6l-2 2M2 16h2M20 16h2M4 20h16" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  )
}

function SunsetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 16a8 8 0 0 0 16 0" />
      <path d="M12 8V5M5.6 12.4l-2-2M18.4 12.4l2-2M2 16h2M20 16h2M4 20h16" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.6 6.6 0 0 0 20 14.5Z" />
    </svg>
  )
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ToneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.6c3.4 3.8 7 7.5 7 11.2a7 7 0 1 1-14 0c0-3.7 3.6-7.4 7-11.2Z" />
      <path d="M9.2 14.6a2.9 2.9 0 0 0 2.9 2.9" />
    </svg>
  )
}

// Reading icons deliberately differ from the sun/moon time-of-day glyphs.
function ReadingDarkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ReadingLightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 3.5h9l4 4v13h-13Z" />
      <path d="M14.5 3.5v4h4M8.5 12h7M8.5 15.5h5" />
    </svg>
  )
}

const ICONS: Record<SceneThemeId, () => ReactElement> = {
  morning: SunriseIcon,
  noon: SunIcon,
  sunset: SunsetIcon,
  night: MoonIcon,
}

const LABELS: Record<SceneThemeId, string> = {
  morning: 'Morning',
  noon: 'Noon',
  sunset: 'Sunset',
  night: 'Night',
}

const READING_ICONS: Record<ReadingAppearance, () => ReactElement> = {
  dark: ReadingDarkIcon,
  light: ReadingLightIcon,
}

const READING_LABELS: Record<ReadingAppearance, string> = {
  dark: 'Dark',
  light: 'Light',
}

const TEMPERATURE_LABELS: Record<ReadingTemperature, string> = {
  cool: 'Cool',
  neutral: 'Neutral',
  warm: 'Warm',
}

interface ThemeToggleProps {
  onRandomize: () => void
}

/** Corner control bar: scene time of day, or reading appearance + text size. */
export default function ThemeToggle({ onRandomize }: ThemeToggleProps) {
  const { sceneTheme, isAuto, setSceneTheme, resetSceneThemeToAuto } = useSceneTheme()
  const { readingOn, appearance, setAppearance, temperature, setTemperature, textScale, stepTextScale } =
    useReadingMode()
  const reducedMotion = useReducedMotion()
  const barRef = useRef<HTMLDivElement>(null)
  const appearanceRefs = useRef<(HTMLButtonElement | null)[]>([])
  const temperatureRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [moreState, setMoreState] = useState({ mode: false, open: false })
  const moreOpen = moreState.mode === readingOn && moreState.open
  const [readingMenuState, setReadingMenuState] = useState({ mode: false, open: false })
  const readingMenuOpen = readingMenuState.mode === readingOn && readingMenuState.open
  const [popoverState, setPopoverState] = useState<{
    mode: boolean
    value: 'tone' | 'text' | null
  }>({ mode: false, value: null })
  const readingPopover =
    readingMenuOpen && popoverState.mode === readingOn ? popoverState.value : null
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setCollapsed(scrollable > 0 ? window.scrollY / scrollable > 0.22 : false)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!moreOpen && !readingMenuOpen && !readingPopover) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMoreState((state) => ({ ...state, open: false }))
      setReadingMenuState((state) => ({ ...state, open: false }))
      setPopoverState((state) => ({ ...state, value: null }))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [moreOpen, readingMenuOpen, readingPopover])

  useEffect(() => {
    if (!moreOpen && !readingMenuOpen && !readingPopover) return
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (barRef.current?.contains(event.target as Node)) return
      setMoreState((state) => ({ ...state, open: false }))
      setReadingMenuState((state) => ({ ...state, open: false }))
      setPopoverState((state) => ({ ...state, value: null }))
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [moreOpen, readingMenuOpen, readingPopover])

  const toggleReadingMenu = () => {
    setReadingMenuState((state) => ({
      mode: readingOn,
      open: !(state.mode === readingOn && state.open),
    }))
    setPopoverState((state) => ({ ...state, value: null }))
  }

  const togglePopover = (value: 'tone' | 'text') => {
    setPopoverState((state) => {
      const current = state.mode === readingOn ? state.value : null
      return { mode: readingOn, value: current === value ? null : value }
    })
  }

  const handleAppearanceKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
    const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft'
    if (!forward && !backward) return
    event.preventDefault()
    const delta = forward ? 1 : -1
    const next = (index + delta + READING_APPEARANCES.length) % READING_APPEARANCES.length
    setAppearance(READING_APPEARANCES[next])
    appearanceRefs.current[next]?.focus()
  }

  const handleTemperatureKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
    const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft'
    if (!forward && !backward) return
    event.preventDefault()
    const delta = forward ? 1 : -1
    const next = (index + delta + READING_TEMPERATURES.length) % READING_TEMPERATURES.length
    setTemperature(READING_TEMPERATURES[next])
    temperatureRefs.current[next]?.focus()
  }

  const swapDuration = reducedMotion ? 0 : 0.18
  const activeTitle = isAuto ? 'Auto scene (follow local time)' : `${LABELS[sceneTheme]} scene`

  const buttonMotion = {
    layout: true,
    initial: { opacity: 0, scale: 0.75 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.75 },
    transition: { duration: swapDuration },
  }

  const sceneButton = (theme: SceneThemeId) => {
    const Icon = ICONS[theme]
    const active = !isAuto && sceneTheme === theme
    return (
      <motion.button
        key={theme}
        type="button"
        {...buttonMotion}
        className={`scene-toggle-btn${active ? ' is-active' : ''}`}
        aria-label={`${LABELS[theme]} scene`}
        aria-pressed={active}
        data-tooltip={`${LABELS[theme]} scene`}
        title={`${LABELS[theme]} scene`}
        onClick={() => setSceneTheme(theme)}
      >
        <Icon />
      </motion.button>
    )
  }

  return (
    <div
      ref={barRef}
      className={`scene-toggle${readingOn ? ' is-reading' : ''}`}
      role="group"
      aria-label={readingOn ? 'Reading controls' : 'Scene controls'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {readingOn ? (
          <motion.div
            key="reading"
            className="scene-toggle-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: swapDuration }}
          >
            <div className="reading-group" role="radiogroup" aria-label="Reading mode appearance">
              {READING_APPEARANCES.map((option, index) => {
                const Icon = READING_ICONS[option]
                const selected = appearance === option
                return (
                  <button
                    key={option}
                    ref={(node) => {
                      appearanceRefs.current[index] = node
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    className={`scene-toggle-btn${selected ? ' is-active' : ''}`}
                    aria-label={`${READING_LABELS[option]} reading mode`}
                    data-tooltip={`${READING_LABELS[option]} reading`}
                    title={`${READING_LABELS[option]} reading mode`}
                    onClick={() => setAppearance(option)}
                    onKeyDown={(event) => handleAppearanceKeyDown(event, index)}
                  >
                    <Icon />
                  </button>
                )
              })}
            </div>
            <motion.button
              layout
              type="button"
              className={`scene-toggle-btn scene-toggle-more${readingMenuOpen ? ' is-open' : ''}`}
              aria-label={readingMenuOpen ? 'Hide reading options' : 'More reading options'}
              aria-expanded={readingMenuOpen}
              aria-controls="reading-more-options"
              data-tooltip={readingMenuOpen ? 'Hide options' : 'More options'}
              title={readingMenuOpen ? 'Hide reading options' : 'More reading options'}
              onClick={toggleReadingMenu}
            >
              <ChevronDownIcon />
            </motion.button>
            <AnimatePresence initial={false}>
              {readingMenuOpen && (
                <motion.div
                  layout
                  id="reading-more-options"
                  className="scene-toggle-more-panel"
                  role="group"
                  aria-label="More reading options"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: swapDuration }}
                >
                  <button
                    type="button"
                    className={`scene-toggle-btn${readingPopover === 'tone' ? ' is-active' : ''}`}
                    aria-label="Reading tone"
                    aria-expanded={readingPopover === 'tone'}
                    aria-controls="reading-tone-options"
                    data-tooltip="Tone"
                    title="Reading tone"
                    onClick={() => togglePopover('tone')}
                  >
                    <ToneIcon />
                  </button>
                  <button
                    type="button"
                    className={`scene-toggle-btn${readingPopover === 'text' ? ' is-active' : ''}`}
                    aria-label="Text size"
                    aria-expanded={readingPopover === 'text'}
                    aria-controls="reading-text-options"
                    data-tooltip="Text size"
                    title="Text size"
                    onClick={() => togglePopover('text')}
                  >
                    <span className="text-size-glyph">Aa</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only" aria-live="polite">
              {READING_LABELS[appearance]} reading mode, {TEMPERATURE_LABELS[temperature]} tone,{' '}
              {Math.round(textScale * 100)}% text
            </span>
            <AnimatePresence initial={false}>
              {readingPopover === 'tone' && (
                <motion.div
                  id="reading-tone-options"
                  className="scene-toggle-popover"
                  role="radiogroup"
                  aria-label="Reading tone"
                  initial={{ opacity: 0, x: 6, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.96 }}
                  transition={{ duration: swapDuration }}
                >
                  {READING_TEMPERATURES.map((option, index) => {
                    const selected = temperature === option
                    return (
                      <button
                        key={option}
                        ref={(node) => {
                          temperatureRefs.current[index] = node
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        className={`temperature-btn${selected ? ' is-active' : ''}`}
                        title={`${TEMPERATURE_LABELS[option]} tone`}
                        onClick={() => setTemperature(option)}
                        onKeyDown={(event) => handleTemperatureKeyDown(event, index)}
                      >
                        {TEMPERATURE_LABELS[option]}
                      </button>
                    )
                  })}
                </motion.div>
              )}
              {readingPopover === 'text' && (
                <motion.div
                  id="reading-text-options"
                  className="scene-toggle-popover"
                  role="group"
                  aria-label="Text size"
                  initial={{ opacity: 0, x: 6, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.96 }}
                  transition={{ duration: swapDuration }}
                >
                  <span className="popover-caption">Text size</span>
                  <div className="popover-row">
                    <button
                      type="button"
                      className="temperature-btn"
                      aria-label="Smaller text"
                      title="Smaller text"
                      disabled={textScale === TEXT_SCALES[0]}
                      onClick={() => stepTextScale(-1)}
                    >
                      A−
                    </button>
                    <span className="text-scale-value">{Math.round(textScale * 100)}%</span>
                    <button
                      type="button"
                      className="temperature-btn"
                      aria-label="Larger text"
                      title="Larger text"
                      disabled={textScale === TEXT_SCALES[TEXT_SCALES.length - 1]}
                      onClick={() => stepTextScale(1)}
                    >
                      A+
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="scene"
            layout
            className="scene-toggle-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: swapDuration }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {SCENE_THEMES.map((theme) => {
                if (collapsed && (moreOpen || sceneTheme !== theme)) return null
                return sceneButton(theme)
              })}
              {collapsed && !moreOpen && isAuto && (
                <motion.span
                  key="auto-indicator"
                  {...buttonMotion}
                  className="scene-toggle-btn is-active"
                  role="img"
                  aria-label={activeTitle}
                  data-tooltip={activeTitle}
                  title={activeTitle}
                >
                  <AutoIcon />
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              layout
              type="button"
              className={`scene-toggle-btn scene-toggle-more${moreOpen ? ' is-open' : ''}`}
              aria-label={moreOpen ? 'Hide scene options' : 'More scene options'}
              aria-expanded={moreOpen}
              aria-controls="scene-more-options"
              data-tooltip={moreOpen ? 'Hide options' : 'More options'}
              title={moreOpen ? 'Hide scene options' : 'More scene options'}
              onClick={() =>
                setMoreState((state) => ({
                  mode: readingOn,
                  open: !(state.mode === readingOn && state.open),
                }))
              }
            >
              <ChevronDownIcon />
            </motion.button>
            <AnimatePresence initial={false}>
              {moreOpen && (
                <motion.div
                  layout
                  id="scene-more-options"
                  className="scene-toggle-more-panel"
                  role="group"
                  aria-label="More scene options"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: swapDuration }}
                >
                  {collapsed && SCENE_THEMES.map(sceneButton)}
                  {collapsed && <span className="scene-toggle-divider" aria-hidden="true" />}
                  <button
                    type="button"
                    className={`scene-toggle-btn is-auto${isAuto ? ' is-active' : ''}`}
                    aria-label="Auto scene (follow local time)"
                    aria-pressed={isAuto}
                    data-tooltip="Auto — follow local time"
                    title="Auto — follow local time"
                    onClick={resetSceneThemeToAuto}
                  >
                    <AutoIcon />
                  </button>
                  <button
                    type="button"
                    className="scene-toggle-btn"
                    aria-label="Randomize landscape"
                    data-tooltip="Randomize landscape"
                    title="Randomize landscape"
                    onClick={onRandomize}
                  >
                    <ShuffleIcon />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
