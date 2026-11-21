import type { ReactElement } from 'react'
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

interface ThemeToggleProps {
  onRandomize: () => void
}

/** Corner scene controls: time-of-day switch + landscape randomizer. */
export default function ThemeToggle({ onRandomize }: ThemeToggleProps) {
  const { sceneTheme, setSceneTheme } = useSceneTheme()

  return (
    <div className="scene-toggle" role="group" aria-label="Scene controls">
      {SCENE_THEMES.map((theme) => {
        const Icon = ICONS[theme]
        const active = sceneTheme === theme
        return (
          <button
            key={theme}
            type="button"
            className={`scene-toggle-btn${active ? ' is-active' : ''}`}
            aria-label={`${LABELS[theme]} scene`}
            aria-pressed={active}
            title={`${LABELS[theme]} scene`}
            onClick={() => setSceneTheme(theme)}
          >
            <Icon />
          </button>
        )
      })}
      <span className="scene-toggle-divider" aria-hidden="true" />
      <button
        type="button"
        className="scene-toggle-btn"
        aria-label="Randomize landscape"
        title="Randomize landscape"
        onClick={onRandomize}
      >
        <ShuffleIcon />
      </button>
    </div>
  )
}
